# Issue 20 — Categories, Sellers Directory, Seller & About Pages

**Suggested Branch:** `[YOUR-INITIALS]-issue-20-categories-sellers-directory`

> ⚠️ **Updated:** All database queries now use raw SQL via the `pg` driver. Prisma has been removed from the project. Schema is at `src/db/schema.sql`.

> **User Story:** As a community member, I want to view a list of all active sellers so that I can discover new local artisans to support.
> **Acceptance Criteria:** A "Sellers" directory page must list all authenticated artisan profiles with a link to their individual shop pages.

> **User Story:** As an authenticated seller, I want to create a dedicated profile page so that I can share my brand story and craftsmanship with potential buyers.
> **Acceptance Criteria:** The profile must include a bio section, a profile image upload, and a display area for listed items.

**Labels:** `feature`, `frontend` | **Priority:** 🟢 Medium | **Depends on:** Issues 07, 08

## Checklist
- [ ] **Prerequisite:** Ensure Issues 07, 08 are completed.
- [ ] Create `src/app/categories/page.tsx`
- [ ] Create `src/app/seller/[id]/page.tsx`
- [ ] Create `src/app/about/page.tsx`
- [ ] Create `src/app/sellers/page.tsx`

## Files to Create

### File 1 — `src/app/categories/page.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { pool } from '@/lib/db';
import { Palette } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Categories', description: 'Browse handcrafted products by category.' };

export default async function CategoriesPage() {
  const { rows: categories } = await pool.query(
    `SELECT c.*,
            (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'active') as product_count
     FROM categories c
     ORDER BY c.name ASC`
  );

  return (
    <div className="container-app py-8 pb-16">
      <h1 className="font-display text-3xl md:text-4xl text-primary uppercase mb-3">Categories</h1>
      <p className="font-body text-text-muted mb-10">Explore our curated collection of handmade goods</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden group-hover:opacity-90 transition-opacity">
              {cat.image_url ? (
                <Image src={cat.image_url} alt={cat.name} fill sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Palette size={48} className="text-primary/30 group-hover:text-cta transition-colors" />
                </div>
              )}
            </div>
            <div className="p-5">
              <h2 className="font-display text-lg text-primary uppercase mb-1">{cat.name}</h2>
              <p className="font-body text-sm text-text-muted line-clamp-2 mb-2">{cat.description}</p>
              <span className="font-ui text-xs text-accent">{cat.product_count} product{parseInt(cat.product_count) !== 1 ? 's' : ''}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

---

### File 2 — `src/app/seller/[id]/page.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

Key implementation:
- Server component with `generateMetadata`
- Custom SVG icon components: `InstagramIcon`, `XIcon`
- Imports `formatDate` from utils
- Fetches seller with products, images, category using raw SQL via `pool.query`
- Aggregates stats via `SELECT AVG(avg_rating), COUNT(*)` query
- Profile card: avatar, name, location, join date, bio, star rating, social links
- Product grid using `<ProductCard>`

---

### File 3 — `src/app/about/page.tsx`

> No Prisma dependency — this is a static content page. See original issue description for details.

---

### File 4 — `src/app/sellers/page.tsx`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```tsx
import Link from 'next/link';
import Image from 'next/image';
import { pool } from '@/lib/db';
import { Store, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Our Artisans', description: 'Discover handcrafted goods from local sellers.' };

export default async function SellersDirectoryPage() {
  const { rows: sellers } = await pool.query(
    `SELECT u.id, u.name, u.avatar_url, u.location, u.created_at,
            (SELECT COUNT(*) FROM products WHERE seller_id = u.id AND status = 'active') as product_count
     FROM users u
     WHERE u.role = 'seller'
     ORDER BY u.created_at DESC`
  );

  return (
    <div className="container-app py-8 pb-16">
      <h1 className="font-display text-3xl md:text-4xl text-primary uppercase mb-3">Our Artisans</h1>
      <p className="font-body text-text-muted mb-10">Discover the talented creators behind Handcrafted Haven.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sellers.map((seller) => (
          <Link key={seller.id} href={`/seller/${seller.id}`} className="group bg-white rounded-xl shadow-card p-6 flex flex-col items-center text-center hover:shadow-card-hover transition-all hover:-translate-y-1">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-surface">
              {seller.avatar_url ? (
                <Image src={seller.avatar_url} alt={seller.name} width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-cta flex items-center justify-center text-3xl font-bold font-ui text-text">
                  {seller.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <h2 className="font-display text-xl text-primary uppercase mb-1">{seller.name}</h2>
            {seller.location && (
              <p className="font-body text-xs text-text-muted flex items-center gap-1 mb-3">
                <MapPin size={12} /> {seller.location}
              </p>
            )}
            <p className="font-ui text-sm text-accent flex items-center gap-1">
              <Store size={14} /> {seller.product_count} Products
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
```
