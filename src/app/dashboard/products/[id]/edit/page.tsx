import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/dashboard/ProductForm';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'seller') {
    redirect('/');
  }

  const { id } = await params;
  
  // Fetch product and its images
  const { rows: products } = await db.query(
    'SELECT * FROM products WHERE id = $1 AND seller_id = $2',
    [id, session.user.id]
  );

  if (products.length === 0) {
    redirect('/dashboard/products');
  }

  const product = products[0];

  // Fetch images for this product
  const { rows: images } = await db.query(
    'SELECT url, public_id FROM product_images WHERE product_id = $1 ORDER BY display_order ASC',
    [id]
  );

  product.images = images;

  // Fetch categories
  const { rows: categories } = await db.query('SELECT id, name FROM categories ORDER BY name ASC');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-title">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update your product listing details.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <ProductForm initialData={product} categories={categories} />
      </div>
    </div>
  );
}
