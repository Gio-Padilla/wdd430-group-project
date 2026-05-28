# Issue 12 — Auth Server Actions

**Suggested Branch:** `[YOUR-INITIALS]-issue-12-auth-server-actions`


> **User Story:** As a seller, I want to log in securely to my account so that I can manage my inventory and personal details.
> **Acceptance Criteria:** The system must validate credentials against the PostgreSQL database and maintain a secure session.


**Labels:** `feature`, `backend`, `security` | **Priority:** 🔴 Critical | **Depends on:** Issue 04

## Checklist
- [ ] **Prerequisite:** Ensure Issue 04 are completed.
- [ ] Create `src/lib/rateLimit.ts`
- [ ] Create `src/lib/actions/auth.ts`

## Files to Create

### File 1 — `src/lib/rateLimit.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> In-memory sliding-window rate limiter. Prevents brute-force attacks on login.
> Keyed by identifier (e.g. email). No external dependencies.

```	s
// ==============================
// In-Memory Rate Limiter (Sliding Window)
// ==============================
// Prevents brute-force attacks on login/register.
// Keyed by identifier (e.g. email). No external dependencies.
// NOTE: This resets on server restart and is per-process only.
// For multi-instance deployments, use Redis-backed rate limiting.

const attempts = new Map();

const DEFAULT_OPTIONS = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 5,            // max 5 failed attempts per window
};

/**
 * Check if an identifier has exceeded the rate limit.
 * @param {string} identifier - The key to rate limit (e.g. email address)
 * @param {object} [options] - Override defaults
 * @returns {{ limited: boolean, remaining: number, retryAfterMs: number }}
 */
export function checkRateLimit(identifier, options = {}) {
  const { windowMs, maxAttempts } = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();
  const key = identifier.toLowerCase().trim();

  // Get or create entry
  let entry = attempts.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    attempts.set(key, entry);
  }

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < windowMs);

  const remaining = Math.max(0, maxAttempts - entry.timestamps.length);
  const limited = entry.timestamps.length >= maxAttempts;
  const oldestInWindow = entry.timestamps[0] || now;
  const retryAfterMs = limited ? windowMs - (now - oldestInWindow) : 0;

  return { limited, remaining, retryAfterMs };
}

/**
 * Record a failed attempt for an identifier.
 * Call this AFTER a failed login, not on success.
 * @param {string} identifier
 */
export function recordFailedAttempt(identifier) {
  const key = identifier.toLowerCase().trim();
  let entry = attempts.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    attempts.set(key, entry);
  }
  entry.timestamps.push(Date.now());
}

/**
 * Clear all attempts for an identifier (call on successful login).
 * @param {string} identifier
 */
export function clearAttempts(identifier) {
  attempts.delete(identifier.toLowerCase().trim());
}

// Periodic cleanup to prevent memory leaks (every 10 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of attempts) {
      entry.timestamps = entry.timestamps.filter(
        (ts) => now - ts < DEFAULT_OPTIONS.windowMs
      );
      if (entry.timestamps.length === 0) {
        attempts.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
```

---

### File 2 — `src/lib/actions/auth.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	ts
'use server';

import prisma from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';
import { auth, signIn, signOut } from '@/auth';
import { isValidEmail, isStrongPassword } from '@/lib/utils';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rateLimit';
import { revalidatePath } from 'next/cache';

export async function getCurrentUserAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Not authenticated' };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return { success: false, error: 'User not found' };

    return { success: true, data: user };
  } catch (error) {
    console.error('getCurrentUserAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function loginAction(email, password) {
  try {
    if (!email || !password) {
      return { success: false, error: 'Email and password are required' };
    }

    // Rate limiting: max 5 failed attempts per email per 15 minutes
    const rateCheck = checkRateLimit(email);
    if (rateCheck.limited) {
      const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60000);
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${retryMinutes} minute${retryMinutes === 1 ? '' : 's'}.`,
      };
    }

    // Try signing in using NextAuth Credentials provider
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      // Successful login — clear rate limit for this email
      clearAttempts(email);
    } catch (error) {
      // AuthError indicates failed login
      recordFailedAttempt(email);
      return { success: false, error: 'Invalid email or password' };
    }

    // Fetch user data after successful login to return to client
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error('loginAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function registerAction(name, email, password, role) {
  try {
    if (!name || !email || !password) {
      return { success: false, error: 'Name, email, and password are required' };
    }

    if (!isValidEmail(email)) {
      return { success: false, error: 'Invalid email address' };
    }

    const passwordCheck = isStrongPassword(password);
    if (!passwordCheck.valid) {
      return { success: false, error: passwordCheck.message };
    }

    if (role && !['buyer', 'seller'].includes(role)) {
      return { success: false, error: 'Role must be buyer or seller' };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role || 'buyer',
      },
    });

    // Auto-login after registration
    try {
      await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
    } catch (error) {
      // Even if login fails somehow, registration succeeded
      console.error('Auto-login failed after registration', error);
    }

    // Fetch user for response
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return { success: true, data: user };
  } catch (error) {
    console.error('registerAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function logoutAction() {
  try {
    await signOut({ redirect: false });
    return { success: true, message: 'Logged out' };
  } catch (error) {
    console.error('logoutAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateProfileAction(data) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const { name, email, bio, location, avatarUrl, socialLinks, role } = data;

    // Role escalation guard: only allow buyer → seller promotion.
    // Sellers cannot downgrade, and arbitrary roles are rejected.
    if (role) {
      if (role !== 'seller') {
        return { success: false, error: 'Invalid role' };
      }
      if (session.user.role === 'seller') {
        return { success: false, error: 'You are already a seller' };
      }
    }

    if (email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser && existingUser.id !== session.user.id) {
        return { success: false, error: 'Email already in use' };
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(socialLinks !== undefined && { socialLinks }),
        ...(role === 'seller' && session.user.role !== 'seller' && { role }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        bio: true,
        location: true,
        socialLinks: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    revalidatePath('/dashboard/profile');
    revalidatePath('/account');
    return { success: true, data: updated };
  } catch (error) {
    console.error('updateProfileAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteAccountAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    await signOut({ redirect: false });

    return { success: true, message: 'Account deleted' };
  } catch (error) {
    console.error('deleteAccountAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
```
