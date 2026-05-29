'use client';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProductAction } from '@/lib/actions/products';

export default function DeleteProductButton({ productId }: { productId: number }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const data = await deleteProductAction(productId);
      
      if (data.success) {
        showToast('Product deleted successfully', 'success');
        router.refresh();
      } else {
        showToast(data.error || 'Failed to delete product', 'error');
      }
    } catch {
      showToast('Network error while deleting product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors bg-white border border-gray-200 hover:bg-red-50 px-3 py-1.5 rounded-md shadow-sm disabled:opacity-50"
      aria-label="Delete Product"
    >
      <Trash2 size={14} /> <span className="hidden sm:inline">Delete</span>
    </button>
  );
}
