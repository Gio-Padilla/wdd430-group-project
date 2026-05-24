# Issue 02 — Install Dependencies & Configure Build

**Suggested Branch:** `[YOUR-INITIALS]-issue-02-install-dependencies-configure`


**Labels:** `setup` | **Priority:** 🔴 Critical | **Depends on:** Issue 01

## Checklist
- [ ] **Prerequisite:** Ensure Issue 01 are completed.
- [ ] Install production dependencies
- [ ] Install dev dependencies
- [ ] Update `package.json` scripts
- [ ] Create/update `postcss.config.mjs`
- [ ] Create/update `next.config.mjs`
- [ ] Verify `tsconfig.json` has path alias

## Instructions

### 1. Install production dependencies
```bash
pnpm add @prisma/adapter-pg @prisma/client bcryptjs cloudinary jose lucide-react next-cloudinary pg
```

### 2. Install dev dependencies
```bash
pnpm add -D dotenv prisma @tailwindcss/postcss
```

### 3. Update `package.json` scripts section
Open `package.json` and replace the `"scripts"` block with:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "postinstall": "prisma generate"
}
```

### 4. Create/update `postcss.config.mjs`
```	s
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

### 5. Create/update `next.config.mjs`
```	s
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',
      },
    ],
  },
};

export default nextConfig;
```

### 6. Verify `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
```
