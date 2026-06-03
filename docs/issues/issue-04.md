# Issue 04 — Core Libraries & Types (prisma.ts, auth.ts, utils.ts, proxy.ts)

**Suggested Branch:** `[YOUR-INITIALS]-issue-04-core-libraries-types`


> **User Story:** As a seller, I want to log in securely to my account so that I can manage my inventory and personal details.
> **Acceptance Criteria:** The system must validate credentials against the PostgreSQL database and maintain a secure session.


**Labels:** `setup`, `backend`, `security` | **Priority:** 🔴 Critical | **Depends on:** Issue 03

## Checklist
- [ ] **Prerequisite:** Ensure Issue 03 are completed.
- [ ] Create `src/lib/prisma.ts`
- [ ] Create `src/auth.config.ts` (Edge-safe NextAuth config)
- [ ] Create `src/auth.ts` (Full NextAuth config with Credentials provider)
- [ ] Create `src/app/api/auth/[...nextauth]/route.ts` (NextAuth route handler)
- [ ] Create `src/lib/auth.ts` (Password utilities only)
- [ ] Create `src/proxy.ts` (Next.js 16 route guard — uses NextAuth)
- [ ] Create `src/lib/utils.ts`
- [ ] Create `src/types/index.ts`

## Files to Create

### File 1 — `src/lib/prisma.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	s
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis;

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```
### File 2 — `src/auth.config.ts` (Edge-safe — used by proxy)

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> This file contains the edge-compatible NextAuth config used by the proxy (middleware). It does NOT include the Prisma adapter or database calls.

```	ts
import type { NextAuthConfig } from 'next-auth';

// Routes that require authentication
const AUTH_ROUTES = ['/cart', '/checkout', '/account'];

// Routes that require seller role
const SELLER_ROUTES = ['/dashboard'];

// Routes that should redirect authenticated users away
const GUEST_ROUTES = ['/auth/login', '/auth/register'];

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      // Redirect authenticated users away from login/register
      if (isLoggedIn && GUEST_ROUTES.some((route) => pathname.startsWith(route))) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Check auth-required routes
      if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
        if (!isLoggedIn) return false; // Redirect to signIn page
      }

      // Check seller-only routes
      if (SELLER_ROUTES.some((route) => pathname.startsWith(route))) {
        if (!isLoggedIn) return false;
        if (auth?.user?.role !== 'seller') {
          return Response.redirect(new URL('/', nextUrl));
        }
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as number;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Configured in auth.ts
};
```

---

### File 3 — `src/auth.ts` (Full NextAuth config with Credentials provider)

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> This is the main NextAuth configuration. It uses the Credentials provider with bcryptjs for password comparison. No database adapter is used — sessions are JWT-only.

```	ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { authConfig } from './auth.config';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatarUrl,
        };
      },
    }),
  ],
});
```

---

### File 4 — `src/app/api/auth/[...nextauth]/route.ts` (NextAuth Route Handler)

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	ts
export { handlers as GET, handlers as POST } from '@/auth';
```

> ⚠️ Note: You also need to create the `src/app/api/auth/[...nextauth]/` directory in Issue 01's folder structure.

---

### File 5 — `src/lib/auth.ts` (Password utility — kept for registration)

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> This file now only contains password hashing utilities used by the registration server action. All session management is handled by NextAuth.

```	ts
import { hash, compare } from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string) {
  return hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hashedPassword: string) {
  return compare(password, hashedPassword);
}
```

---

### File 6 — `src/proxy.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

> Next.js 16 renamed `middleware.ts` to `proxy.ts`. This file now uses NextAuth's `auth` wrapper from `auth.config.ts`. All route protection logic is handled by the `authorized` callback.

```	ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    '/cart/:path*',
    '/checkout/:path*',
    '/account/:path*',
    '/dashboard/:path*',
    '/auth/:path*',
  ],
};
```

---

### File 4 — `src/lib/utils.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```	s
// ==============================
// Handcrafted Haven — Utility Functions
// ==============================

/**
 * Format a number as USD currency
 */
export function formatPrice(price) {
  const num = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

/**
 * Format a date string to a human-readable format
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Format a date as relative time
 */
export function formatRelativeTime(date) {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return formatDate(date);
}

/**
 * Generate a URL-friendly slug from a string
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncate text to a max length with ellipsis
 */
export function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

/**
 * Capitalize the first letter of a string
 */
export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Get initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name) {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Class name helper — joins truthy values
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generate a random string for unique IDs
 */
export function generateId(length= 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Validate email format
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Check minimum password strength
 */
export function isStrongPassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain an uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain a lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain a number' };
  }
  return { valid: true, message: 'Password is strong' };
}

/**
 * Parse search params into ProductFilters
 */
export function parseProductFilters(searchParams) {
  const get = (key) => {
    const val = searchParams[key];
    return typeof val === 'string' ? val : undefined;
  };

  return {
    category: get('category'),
    minPrice: get('minPrice') ? parseFloat(get('minPrice')) : undefined,
    maxPrice: get('maxPrice') ? parseFloat(get('maxPrice')) : undefined,
    minRating: get('minRating') ? parseInt(get('minRating')) : undefined,
    search: get('search'),
    sort: get('sort'),
    page: get('page') ? parseInt(get('page')) : 1,
    pageSize: get('pageSize') ? parseInt(get('pageSize')) : 12,
  };
}
```


---

### File 5 — `src/types/index.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```ts
import { Prisma } from '@prisma/client';

export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

export type ProductWithReviews = Prisma.ProductGetPayload<{
  include: {
    category: true;
    reviews: {
      include: {
        user: true;
      };
    };
  };
}>;

export type OrderWithItems = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

export type CartItemWithProduct = Prisma.CartItemGetPayload<{
  include: {
    product: true;
  };
}>;

export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: true;
  };
}>;
```
