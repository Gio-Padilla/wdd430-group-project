'use client';
import { Trash2 } from 'lucide-react';
import { useToast } from '@/components/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteProductAction } from '@/lib/actions/products';
import Modal from '@/components/ui/Modal';

export default function DeleteProductButton({ productId }: { productId: number }) {
  const { showToast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const data = await deleteProductAction(productId);
      
      if (data.success) {
        showToast('Product deleted successfully', 'success');
        setIsModalOpen(false);
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
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        className="inline-flex items-center justify-center text-red-600 hover:text-red-700 transition-colors bg-white border border-gray-200 hover:bg-red-50 p-1.5 sm:px-3 sm:py-1.5 rounded-md shadow-sm disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        aria-label="Delete Product"
      >
        <Trash2 size={14} /> <span className="hidden sm:inline">Delete</span>
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Delete Product"
        description="Are you absolutely sure you want to delete this product? All reviews and data associated with this product will be permanently removed. This action cannot be undone."
        actionButton={
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isDeleting && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
            Yes, delete product
          </button>
        }
      >
        <p className="text-sm text-gray-700 mb-2 bg-red-50 p-3 rounded-lg border border-red-100">
          <strong>Warning:</strong> This listing will be immediately removed from the store, and buyers will no longer be able to purchase or view it.
        </p>
      </Modal>
    </>
  );
}
