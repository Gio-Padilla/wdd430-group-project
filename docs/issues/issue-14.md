# Issue 14 — Product & Review Server Actions

**Suggested Branch:** `[YOUR-INITIALS]-issue-14-product-review-actions`

> ⚠️ **Updated:** All database queries now use raw SQL via the `pg` driver. Prisma has been removed from the project. Schema is at `src/db/schema.sql`.

**Labels:** `feature`, `backend` | **Priority:** 🟡 High | **Depends on:** Issues 04, 12

## Checklist
- [ ] **Prerequisite:** Ensure Issues 04, 12 are completed.
- [ ] Create `src/lib/actions/products.ts`
- [ ] Create `src/lib/actions/reviews.ts`

## Files to Create

### File 1 — `src/lib/actions/products.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```ts
'use server';

import { pool } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createProductAction(data) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== 'seller') {
      return { success: false, error: 'Only sellers can create products' };
    }

    const { title, description, price, categoryId, tags, inventoryQty, status, images } = data;

    if (!title || !description || !price || !categoryId) {
      return { success: false, error: 'Title, description, price, and category are required' };
    }

    const slug = slugify(title);
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const { rows } = await client.query(
        `INSERT INTO products (seller_id, category_id, title, slug, description, price, inventory_qty, status, tags)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id, slug`,
        [session.user.id, parseInt(categoryId), title, slug, description, parseFloat(price),
         parseInt(inventoryQty) || 0, status || 'draft', tags || []]
      );

      const productId = rows[0].id;

      if (images && images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          await client.query(
            `INSERT INTO product_images (product_id, url, public_id, display_order, is_primary)
             VALUES ($1, $2, $3, $4, $5)`,
            [productId, images[i].url, images[i].publicId || null, i, i === 0]
          );
        }
      }

      await client.query('COMMIT');

      revalidatePath('/shop');
      revalidatePath('/dashboard/products');
      return { success: true, data: { id: productId, slug: rows[0].slug } };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('createProductAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateProductAction(id, data) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const productId = parseInt(id);

    const { rows: existing } = await pool.query(
      'SELECT id, seller_id, slug FROM products WHERE id = $1', [productId]
    );
    if (existing.length === 0 || existing[0].seller_id !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    const { title, description, price, categoryId, tags, inventoryQty, status, images } = data;

    const sets: string[] = [];
    const vals: any[] = [];
    let i = 1;

    if (title) { sets.push(`title = $${i++}`); vals.push(title); }
    if (description) { sets.push(`description = $${i++}`); vals.push(description); }
    if (price) { sets.push(`price = $${i++}`); vals.push(parseFloat(price)); }
    if (categoryId) { sets.push(`category_id = $${i++}`); vals.push(parseInt(categoryId)); }
    if (tags) { sets.push(`tags = $${i++}`); vals.push(tags); }
    if (inventoryQty !== undefined) { sets.push(`inventory_qty = $${i++}`); vals.push(parseInt(inventoryQty)); }
    if (status) { sets.push(`status = $${i++}`); vals.push(status); }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      if (sets.length > 0) {
        vals.push(productId);
        await client.query(
          `UPDATE products SET ${sets.join(', ')} WHERE id = $${i}`, vals
        );
      }

      if (images) {
        await client.query('DELETE FROM product_images WHERE product_id = $1', [productId]);
        for (let j = 0; j < images.length; j++) {
          await client.query(
            `INSERT INTO product_images (product_id, url, public_id, display_order, is_primary)
             VALUES ($1, $2, $3, $4, $5)`,
            [productId, images[j].url, images[j].publicId || null, j, j === 0]
          );
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    revalidatePath('/shop');
    revalidatePath(`/shop/${existing[0].slug}`);
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    console.error('updateProductAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function deleteProductAction(id) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const productId = parseInt(id);

    const { rows } = await pool.query(
      'SELECT id, seller_id FROM products WHERE id = $1', [productId]
    );
    if (rows.length === 0 || rows[0].seller_id !== session.user.id) {
      return { success: false, error: 'Not found or unauthorized' };
    }

    await pool.query('DELETE FROM products WHERE id = $1', [productId]);

    revalidatePath('/shop');
    revalidatePath('/dashboard/products');
    return { success: true, message: 'Product deleted' };
  } catch (error) {
    console.error('deleteProductAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
```

---

### File 2 — `src/lib/actions/reviews.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```ts
'use server';

import { pool } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createReviewAction(data) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Must be logged in to review' };

    const { productId, rating, comment, orderItemId } = data;

    if (!productId || !rating || !comment || !orderItemId) {
      return { success: false, error: 'Product ID, order item ID, rating, and comment are required' };
    }
    if (rating < 1 || rating > 5) {
      return { success: false, error: 'Rating must be between 1 and 5' };
    }

    // Verify order item belongs to user and hasn't been reviewed
    const { rows: oiRows } = await pool.query(
      `SELECT oi.id, oi.product_id, o.user_id
       FROM order_items oi
       JOIN orders o ON o.id = oi.order_id
       WHERE oi.id = $1`,
      [parseInt(orderItemId)]
    );

    if (oiRows.length === 0 || oiRows[0].user_id !== session.user.id || oiRows[0].product_id !== parseInt(productId)) {
      return { success: false, error: 'Invalid order item or unauthorized' };
    }

    const { rows: existingReview } = await pool.query(
      'SELECT id FROM reviews WHERE order_item_id = $1', [parseInt(orderItemId)]
    );
    if (existingReview.length > 0) {
      return { success: false, error: 'You have already reviewed this specific purchase' };
    }

    // Check user isn't reviewing own product
    const { rows: productRows } = await pool.query(
      'SELECT seller_id, slug FROM products WHERE id = $1', [parseInt(productId)]
    );
    if (productRows[0]?.seller_id === session.user.id) {
      return { success: false, error: 'You cannot review your own product' };
    }

    // Create review
    const { rows: reviewRows } = await pool.query(
      `INSERT INTO reviews (product_id, user_id, order_item_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [parseInt(productId), session.user.id, parseInt(orderItemId), parseInt(rating), comment]
    );

    // Update product avg rating
    const { rows: stats } = await pool.query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
       FROM reviews WHERE product_id = $1`,
      [parseInt(productId)]
    );

    await pool.query(
      `UPDATE products SET avg_rating = $1, review_count = $2 WHERE id = $3`,
      [parseFloat(stats[0].avg_rating) || 0, parseInt(stats[0].review_count), parseInt(productId)]
    );

    revalidatePath('/account');
    revalidatePath(`/shop/${productRows[0]?.slug}`);
    return { success: true, data: reviewRows[0] };
  } catch (error) {
    console.error('createReviewAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function replyToReviewAction(reviewId, sellerReply) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const rId = parseInt(reviewId, 10);
    if (isNaN(rId)) return { success: false, error: 'Invalid review ID' };
    if (sellerReply === undefined) return { success: false, error: 'sellerReply is required' };

    const { rows: reviewRows } = await pool.query(
      `SELECT r.id, p.seller_id, p.slug
       FROM reviews r
       JOIN products p ON p.id = r.product_id
       WHERE r.id = $1`,
      [rId]
    );

    if (reviewRows.length === 0) return { success: false, error: 'Review not found' };
    if (reviewRows[0].seller_id !== session.user.id) {
      return { success: false, error: 'Forbidden. Only the seller can reply to this review.' };
    }

    const { rows: updated } = await pool.query(
      `UPDATE reviews SET seller_reply = $1, seller_reply_at = $2
       WHERE id = $3 RETURNING *`,
      [sellerReply === '' ? null : sellerReply, sellerReply === '' ? null : new Date(), rId]
    );

    revalidatePath(`/shop/${reviewRows[0].slug}`);
    return { success: true, data: updated[0] };
  } catch (error) {
    console.error('replyToReviewAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
```
