# Issue 16 — API Routes (Products, Categories, Sellers)

**Suggested Branch:** `[YOUR-INITIALS]-issue-16-api-routes-products`

> ⚠️ **Updated:** All database queries now use raw SQL via the `pg` driver. Prisma has been removed from the project. Schema is at `src/db/schema.sql`.

**Labels:** `feature`, `backend` | **Priority:** 🟡 High | **Depends on:** Issue 04

## Checklist
- [ ] **Prerequisite:** Ensure Issue 04 are completed.
- [ ] Create `src/app/api/products/route.ts`
- [ ] Create `src/app/api/products/[id]/route.ts`
- [ ] Create `src/app/api/categories/route.ts`
- [ ] Create `src/app/api/sellers/[id]/route.ts`

## Files to Create

### File 1 — `src/app/api/products/route.ts`

```ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const minRating = searchParams.get('minRating');
    const sellerId = searchParams.get('sellerId');

    // Build dynamic WHERE clause
    const conditions: string[] = [`p.status = 'active'`];
    const vals: any[] = [];
    let i = 1;

    if (category) { conditions.push(`c.slug = $${i++}`); vals.push(category); }
    if (search) {
      conditions.push(`(p.title ILIKE $${i} OR p.description ILIKE $${i} OR $${i+1} = ANY(p.tags))`);
      vals.push(`%${search}%`); i++;
      vals.push(search.toLowerCase()); i++;
    }
    if (minPrice) { conditions.push(`p.price >= $${i++}`); vals.push(parseFloat(minPrice)); }
    if (maxPrice) { conditions.push(`p.price <= $${i++}`); vals.push(parseFloat(maxPrice)); }
    if (minRating) { conditions.push(`p.avg_rating >= $${i++}`); vals.push(parseFloat(minRating)); }
    if (sellerId) { conditions.push(`p.seller_id = $${i++}`); vals.push(parseInt(sellerId)); }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'p.created_at DESC';
    if (sort === 'price_asc') orderBy = 'p.price ASC';
    else if (sort === 'price_desc') orderBy = 'p.price DESC';
    else if (sort === 'rating') orderBy = 'p.avg_rating DESC';

    const offset = (page - 1) * pageSize;

    const [itemsResult, countResult] = await Promise.all([
      pool.query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug,
                s.id as seller_id, s.name as seller_name, s.avatar_url as seller_avatar,
                (SELECT url FROM product_images WHERE product_id = p.id ORDER BY display_order ASC LIMIT 1) as image_url
         FROM products p
         JOIN categories c ON c.id = p.category_id
         JOIN users s ON s.id = p.seller_id
         ${whereClause}
         ORDER BY ${orderBy}
         LIMIT $${i++} OFFSET $${i++}`,
        [...vals, pageSize, offset]
      ),
      pool.query(
        `SELECT COUNT(*) FROM products p
         JOIN categories c ON c.id = p.category_id
         ${whereClause}`,
        vals
      ),
    ]);

    const total = parseInt(countResult.rows[0].count);

    return NextResponse.json({
      success: true,
      data: {
        items: itemsResult.rows,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
```

---

### File 2 — `src/app/api/products/[id]/route.ts`

```ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { rows: products } = await pool.query(
      `SELECT p.*, c.name as category_name, c.slug as category_slug,
              s.id as seller_id, s.name as seller_name, s.avatar_url as seller_avatar,
              s.bio as seller_bio, s.location as seller_location
       FROM products p
       JOIN categories c ON c.id = p.category_id
       JOIN users s ON s.id = p.seller_id
       WHERE p.id = $1`,
      [parseInt(id)]
    );

    if (products.length === 0) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    const { rows: images } = await pool.query(
      'SELECT * FROM product_images WHERE product_id = $1 ORDER BY display_order ASC',
      [parseInt(id)]
    );

    const { rows: reviews } = await pool.query(
      `SELECT r.*, u.id as user_id, u.name as user_name, u.avatar_url as user_avatar
       FROM reviews r
       JOIN users u ON u.id = r.user_id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: { ...products[0], images, reviews },
    });
  } catch (error) {
    console.error('Product GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
```

---

### File 3 — `src/app/api/categories/route.ts`

```ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT c.*,
              (SELECT COUNT(*) FROM products WHERE category_id = c.id AND status = 'active') as product_count
       FROM categories c
       ORDER BY c.name ASC`
    );

    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    console.error('Categories GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
```

---

### File 4 — `src/app/api/sellers/[id]/route.ts`

```ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { rows: sellers } = await pool.query(
      `SELECT id, name, avatar_url, bio, location, social_links, created_at
       FROM users WHERE id = $1 AND role = 'seller'`,
      [parseInt(id)]
    );

    if (sellers.length === 0) {
      return NextResponse.json({ success: false, error: 'Seller not found' }, { status: 404 });
    }

    const { rows: products } = await pool.query(
      `SELECT p.*,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url,
              c.name as category_name, c.slug as category_slug
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.seller_id = $1 AND p.status = 'active'
       ORDER BY p.created_at DESC`,
      [parseInt(id)]
    );

    const { rows: stats } = await pool.query(
      `SELECT AVG(avg_rating) as avg_rating, COUNT(*) as total_products
       FROM products WHERE seller_id = $1 AND status = 'active'`,
      [parseInt(id)]
    );

    return NextResponse.json({
      success: true,
      data: {
        ...sellers[0],
        products,
        stats: {
          totalProducts: parseInt(stats[0].total_products),
          avgRating: parseFloat(stats[0].avg_rating) || 0,
        },
      },
    });
  } catch (error) {
    console.error('Seller GET error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
```
