'use server';

import { db as pool } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function createProductAction(data: any) {
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

export async function updateProductAction(id: any, data: any) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const productId = parseInt(id);

    const { rows: existing } = await pool.query(
      'SELECT id, seller_id, slug FROM products WHERE id = $1', [productId]
    );
    if (existing.length === 0 || String(existing[0].seller_id) !== String(session.user.id)) {
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

export async function deleteProductAction(id: any) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const productId = parseInt(id);

    const { rows } = await pool.query(
      'SELECT id, seller_id FROM products WHERE id = $1', [productId]
    );
    if (rows.length === 0 || String(rows[0].seller_id) !== String(session.user.id)) {
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
