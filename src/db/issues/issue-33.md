# Issue 12 — Auth Server Actions

**Suggested Branch:** `[YOUR-INITIALS]-issue-12-auth-server-actions`

> ⚠️ **Updated:** All database queries now use raw SQL via the `pg` driver. Prisma has been removed from the project. Schema is at `src/db/schema.sql`.

**Labels:** `feature`, `backend` | **Priority:** 🔴 Critical | **Depends on:** Issues 03, 04

## Checklist
- [ ] **Prerequisite:** Ensure Issues 03, 04 are completed.
- [ ] Create `src/lib/rateLimit.ts`
- [ ] Create `src/lib/actions/auth.ts`

## Files to Create

### File 1 — `src/lib/rateLimit.ts`

> This file does NOT interact with the database and remains unchanged.

```ts
const attempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

export function checkRateLimit(key: string) {
  const record = attempts.get(key);
  if (!record) return { limited: false };
  if (Date.now() - record.firstAttempt > WINDOW_MS) {
    attempts.delete(key);
    return { limited: false };
  }
  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (Date.now() - record.firstAttempt);
    return { limited: true, retryAfterMs };
  }
  return { limited: false };
}

export function recordFailedAttempt(key: string) {
  const record = attempts.get(key);
  if (!record || Date.now() - record.firstAttempt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttempt: Date.now() });
  } else {
    record.count++;
  }
}

export function clearAttempts(key: string) {
  attempts.delete(key);
}

// Periodic cleanup
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of attempts.entries()) {
      if (now - record.firstAttempt > WINDOW_MS && record.count === 0) {
        attempts.delete(key);
      }
      if (record.count > 0) {
        record.count = Math.max(0, record.count - 1);
      }
      if (record.count === 0 && attempts.has(key) && attempts.get(key)!.count === 0 && record.count === 0 && attempts.size > 0 && now - record.firstAttempt > WINDOW_MS && attempts.get(key)?.count?.toString().length === 0) {
        attempts.delete(key);
      }
      if (record.count === 0) {
        attempts.delete(key);
      }
    }
  }, 10 * 60 * 1000);
}
```

---

### File 2 — `src/lib/actions/auth.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```ts
'use server';

import { pool } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { auth, signIn, signOut } from '@/auth';
import { isValidEmail, isStrongPassword } from '@/lib/utils';
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rateLimit';
import { revalidatePath } from 'next/cache';

const USER_SELECT_FIELDS = 'id, email, name, role, avatar_url, bio, location, social_links, created_at, updated_at';

function mapUserRow(row: any) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    location: row.location,
    socialLinks: row.social_links,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getCurrentUserAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Not authenticated' };

    const { rows } = await pool.query(
      `SELECT ${USER_SELECT_FIELDS} FROM users WHERE id = $1`,
      [session.user.id]
    );

    if (rows.length === 0) return { success: false, error: 'User not found' };

    return { success: true, data: mapUserRow(rows[0]) };
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

    const rateCheck = checkRateLimit(email);
    if (rateCheck.limited) {
      const retryMinutes = Math.ceil(rateCheck.retryAfterMs / 60000);
      return {
        success: false,
        error: `Too many login attempts. Please try again in ${retryMinutes} minute${retryMinutes === 1 ? '' : 's'}.`,
      };
    }

    try {
      await signIn('credentials', { email, password, redirect: false });
      clearAttempts(email);
    } catch (error) {
      recordFailedAttempt(email);
      return { success: false, error: 'Invalid email or password' };
    }

    const { rows } = await pool.query(
      `SELECT ${USER_SELECT_FIELDS} FROM users WHERE email = $1`,
      [email]
    );

    return { success: true, data: mapUserRow(rows[0]) };
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

    const { rows: existing } = await pool.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (existing.length > 0) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const passwordHash = await hashPassword(password);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)`,
      [name, email, passwordHash, role || 'buyer']
    );

    try {
      await signIn('credentials', { email, password, redirect: false });
    } catch (error) {
      console.error('Auto-login failed after registration', error);
    }

    const { rows } = await pool.query(
      `SELECT ${USER_SELECT_FIELDS} FROM users WHERE email = $1`,
      [email]
    );

    return { success: true, data: mapUserRow(rows[0]) };
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

    if (role) {
      if (role !== 'seller') return { success: false, error: 'Invalid role' };
      if (session.user.role === 'seller') return { success: false, error: 'You are already a seller' };
    }

    if (email) {
      const { rows: clash } = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2', [email, session.user.id]
      );
      if (clash.length > 0) return { success: false, error: 'Email already in use' };
    }

    // Build dynamic SET clause
    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;

    if (name) { sets.push(`name = $${i++}`); vals.push(name); }
    if (email) { sets.push(`email = $${i++}`); vals.push(email); }
    if (bio !== undefined) { sets.push(`bio = $${i++}`); vals.push(bio); }
    if (location !== undefined) { sets.push(`location = $${i++}`); vals.push(location); }
    if (avatarUrl !== undefined) { sets.push(`avatar_url = $${i++}`); vals.push(avatarUrl); }
    if (socialLinks !== undefined) { sets.push(`social_links = $${i++}`); vals.push(JSON.stringify(socialLinks)); }
    if (role === 'seller' && session.user.role !== 'seller') { sets.push(`role = $${i++}`); vals.push('seller'); }

    if (sets.length === 0) return { success: false, error: 'No fields to update' };

    vals.push(session.user.id);
    const { rows } = await pool.query(
      `UPDATE users SET ${sets.join(', ')} WHERE id = $${i} RETURNING ${USER_SELECT_FIELDS}`,
      vals
    );

    revalidatePath('/dashboard/profile');
    revalidatePath('/account');
    return { success: true, data: mapUserRow(rows[0]) };
  } catch (error) {
    console.error('updateProfileAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteAccountAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    await pool.query('DELETE FROM users WHERE id = $1', [session.user.id]);
    await signOut({ redirect: false });

    return { success: true, message: 'Account deleted' };
  } catch (error) {
    console.error('deleteAccountAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
```
