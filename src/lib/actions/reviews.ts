'use server';

import { db as pool } from '@/lib/db';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function createReviewAction(data: any) {
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

export async function replyToReviewAction(reviewId: any, sellerReply: any) {
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
