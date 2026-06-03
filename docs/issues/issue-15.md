# Issue 15 — Cart & Order Server Actions

**Suggested Branch:** `[YOUR-INITIALS]-issue-15-cart-order-actions`

> ⚠️ **Updated:** All database queries now use raw SQL via the `pg` driver. Prisma has been removed from the project. Schema is at `src/db/schema.sql`.

**Labels:** `feature`, `backend` | **Priority:** 🟡 High | **Depends on:** Issues 04, 12

## Checklist
- [ ] **Prerequisite:** Ensure Issues 04, 12 are completed.
- [ ] Create `src/lib/actions/cart.ts`
- [ ] Create `src/lib/actions/orders.ts`

## Files to Create

### File 1 — `src/lib/actions/cart.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```ts
'use server';

import { pool } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getCartAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const { rows } = await pool.query(
      `SELECT ci.id, ci.quantity, ci.created_at,
              p.id as product_id, p.title, p.slug, p.price, p.inventory_qty, p.status,
              (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url,
              s.id as seller_id, s.name as seller_name
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       JOIN users s ON s.id = p.seller_id
       WHERE ci.user_id = $1
       ORDER BY ci.created_at DESC`,
      [session.user.id]
    );

    return { success: true, data: rows };
  } catch (error) {
    console.error('getCartAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function addToCartAction(productId, quantity = 1) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };
    if (!productId) return { success: false, error: 'Product ID is required' };

    const { rows: product } = await pool.query(
      'SELECT id, status FROM products WHERE id = $1', [parseInt(productId)]
    );
    if (product.length === 0 || product[0].status !== 'active') {
      return { success: false, error: 'Product not available' };
    }

    // Upsert: insert or increment quantity
    const { rows } = await pool.query(
      `INSERT INTO cart_items (user_id, product_id, quantity)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, product_id)
       DO UPDATE SET quantity = cart_items.quantity + $3
       RETURNING *`,
      [session.user.id, parseInt(productId), quantity]
    );

    revalidatePath('/cart');
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('addToCartAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function updateCartQuantityAction(cartItemId, quantity) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };
    if (!quantity || quantity < 1) return { success: false, error: 'Valid quantity is required' };

    const { rows: existing } = await pool.query(
      'SELECT id, user_id FROM cart_items WHERE id = $1', [parseInt(cartItemId)]
    );
    if (existing.length === 0 || existing[0].user_id !== session.user.id) {
      return { success: false, error: 'Not found' };
    }

    const { rows } = await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *',
      [quantity, parseInt(cartItemId)]
    );

    revalidatePath('/cart');
    return { success: true, data: rows[0] };
  } catch (error) {
    console.error('updateCartQuantityAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function removeCartItemAction(cartItemId) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const { rows: existing } = await pool.query(
      'SELECT id, user_id FROM cart_items WHERE id = $1', [parseInt(cartItemId)]
    );
    if (existing.length === 0 || existing[0].user_id !== session.user.id) {
      return { success: false, error: 'Not found' };
    }

    await pool.query('DELETE FROM cart_items WHERE id = $1', [parseInt(cartItemId)]);

    revalidatePath('/cart');
    return { success: true, message: 'Item removed' };
  } catch (error) {
    console.error('removeCartItemAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
```

---

### File 2 — `src/lib/actions/orders.ts`

> This is just a suggestion so you know where to start, how to implement, feel free to adapt and change as you go

```ts
'use server';

import { pool } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function getOrdersAction() {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };

    const { rows: orders } = await pool.query(
      `SELECT o.id, o.status, o.total_amount, o.shipping_address, o.created_at,
              json_agg(json_build_object(
                'id', oi.id,
                'quantity', oi.quantity,
                'unitPrice', oi.unit_price,
                'productId', p.id,
                'productTitle', p.title,
                'productSlug', p.slug,
                'imageUrl', (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1)
              )) as items
       FROM orders o
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p ON p.id = oi.product_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [session.user.id]
    );

    return { success: true, data: orders };
  } catch (error) {
    console.error('getOrdersAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}

export async function createOrderAction(shippingAddress) {
  try {
    const session = await auth();
    if (!session?.user) return { success: false, error: 'Unauthorized' };
    if (!shippingAddress) return { success: false, error: 'Shipping address is required' };

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Get cart items with product data
      const { rows: cartItems } = await client.query(
        `SELECT ci.id, ci.product_id, ci.quantity,
                p.title, p.price, p.status, p.inventory_qty
         FROM cart_items ci
         JOIN products p ON p.id = ci.product_id
         WHERE ci.user_id = $1`,
        [session.user.id]
      );

      if (cartItems.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, error: 'Cart is empty' };
      }

      // Validate stock and calculate total
      let totalAmount = 0;
      for (const item of cartItems) {
        if (item.status !== 'active' || item.inventory_qty < item.quantity) {
          await client.query('ROLLBACK');
          return { success: false, error: `${item.title} is out of stock or has insufficient quantity` };
        }
        totalAmount += Number(item.price) * item.quantity;
      }

      // Create order
      const { rows: orderRows } = await client.query(
        `INSERT INTO orders (user_id, status, total_amount, shipping_address)
         VALUES ($1, 'confirmed', $2, $3) RETURNING id`,
        [session.user.id, totalAmount, JSON.stringify(shippingAddress)]
      );
      const orderId = orderRows[0].id;

      // Create order items + update inventory
      for (const item of cartItems) {
        await client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, Number(item.price)]
        );
        await client.query(
          `UPDATE products SET inventory_qty = inventory_qty - $1 WHERE id = $2`,
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await client.query('DELETE FROM cart_items WHERE user_id = $1', [session.user.id]);

      await client.query('COMMIT');

      revalidatePath('/account');
      revalidatePath('/dashboard/products');
      return { success: true, data: { id: orderId } };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('createOrderAction error:', error);
    return { success: false, error: 'Internal server error' };
  }
}
```
