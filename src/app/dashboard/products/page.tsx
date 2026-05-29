import { db } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import DeleteProductButton from '@/components/dashboard/DeleteProductButton';
import { Plus, Edit, Image as ImageIcon } from 'lucide-react';

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
    <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold font-title text-gray-900 tracking-tight">Products</h1>
            <p className="text-gray-500 mt-1">Manage your catalog and inventory.</p>
        </div>
        <Link 
          href="/dashboard/products/new"
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all text-sm font-medium shadow-sm hover:shadow active:scale-95"
        >
          <Plus size={18} /> New Listing
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
             <ImageIcon className="text-gray-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Your catalog is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Start showcasing your artisan work to the world by adding your very first product listing.</p>
          <Link 
            href="/dashboard/products/new"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <Plus size={20} /> Create First Product
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100 backdrop-blur-md sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 font-semibold">Item</th>
                  <th className="px-6 py-4 font-semibold">Category</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Stock</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                          {product.image ? (
                             <img src={product.image} alt={product.title} className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-base">{product.title}</div>
                          <div className="text-xs text-gray-400 font-medium">SKU: {String(product.id).padStart(6, '0')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">{product.category_name}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">${Number(product.price).toFixed(2)}</td>
                    <td className="px-6 py-4 text-gray-600">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold ${product.inventory_qty > 0 ? 'bg-gray-100 text-gray-700' : 'bg-red-50 text-red-700'}`}>
                            {product.inventory_qty} in stock
                        </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        product.status === 'active' ? 'success' : 
                        product.status === 'draft' ? 'default' : 'error'
                      }>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Link 
                          href={`/dashboard/products/${product.id}/edit`}
                          className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors bg-white border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-md shadow-sm"
                        >
                          <Edit size={14} /> <span className="hidden sm:inline">Edit</span>
                        </Link>
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