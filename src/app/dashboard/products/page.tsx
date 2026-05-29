import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import DeleteProductButton from './DeleteProductButton';
import { Plus, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardProductsPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'seller') {
    redirect('/');
  }

  const { rows: products } = await db.query(
    `SELECT p.*, c.name as category_name, 
            (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image
     FROM products p 
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.seller_id = $1
     ORDER BY p.created_at DESC`,
    [session.user.id]
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold font-title">My Products</h1>
        <Link 
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No products yet</h2>
          <p className="text-gray-500 mb-6">Start building your catalog by adding your first product.</p>
          <Link 
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus size={18} /> Add First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Product</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 border flex-shrink-0">
                          {product.image ? (
                             <img src={product.image} alt={product.title} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs text-center">No img</div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{product.title}</div>
                          <div className="text-xs text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{product.category_name}</td>
                    <td className="px-6 py-4 font-medium">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">{product.inventory_qty}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        product.status === 'active' ? 'success' : 
                        product.status === 'draft' ? 'default' : 'error'
                      }>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/dashboard/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1 text-primary/80 hover:text-primary transition-colors"
                        >
                          <Edit size={14} /> Edit
                        </Link>
                        <span className="text-gray-300">|</span>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}