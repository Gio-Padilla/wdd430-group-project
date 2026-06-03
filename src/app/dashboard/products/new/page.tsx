import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProductForm from '@/components/dashboard/ProductForm';

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'seller') {
    redirect('/');
  }

  // Fetch categories
  const { rows: categories } = await db.query('SELECT id, name FROM categories ORDER BY name ASC');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-title">Add New Product</h1>
        <p className="text-gray-600 mt-1">Create a new listing for your artisan shop.</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}