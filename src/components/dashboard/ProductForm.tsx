'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/providers/ToastProvider';
import { createProductAction, updateProductAction } from '@/lib/actions/products';
import CloudinaryUploadButton from '@/components/ui/CloudinaryUploadButton';
import { X } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

interface ImageType {
  url: string;
  publicId: string;
}

interface ProductFormProps {
  initialData?: any;
  categories: Category[];
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price ? String(initialData.price) : '');
  const [inventoryQty, setInventoryQty] = useState(initialData?.inventory_qty ? String(initialData.inventory_qty) : '0');
  const [categoryId, setCategoryId] = useState(initialData?.category_id ? String(initialData.category_id) : '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [images, setImages] = useState<ImageType[]>(
    initialData?.images?.map((img: any) => ({ url: img.url, publicId: img.public_id })) || []
  );

  const handleUpload = (result: any) => {
    if (result.info && result.info.secure_url) {
      setImages((prev) => [
        ...prev,
        { url: result.info.secure_url, publicId: result.info.public_id },
      ]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedTags = tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      const payload = {
        title,
        description,
        price,
        inventoryQty,
        categoryId,
        status,
        tags: parsedTags,
        images
      };

      let res;
      if (initialData?.id) {
        res = await updateProductAction(initialData.id, payload);
      } else {
        res = await createProductAction(payload);
      }

      if (res.success) {
        showToast(initialData?.id ? 'Product updated successfully!' : 'Product created successfully!', 'success');
        router.push('/dashboard/products');
        router.refresh();
      } else {
        showToast(res.error || 'Failed to save product.', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An unexpected error occurred.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            required
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Handmade Ceramic Vase"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Describe your product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Quantity *</label>
          <input
            required
            type="number"
            min="0"
            step="1"
            value={inventoryQty}
            onChange={(e) => setInventoryQty(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. ceramic, handmade, gift"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-square border rounded-md overflow-hidden bg-gray-100">
                {/* Using standard img to avoid next/image domain configuration issues for uploads */}
                <img src={img.url} alt={`Upload ${index + 1}`} className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <div className="col-span-1">
               <CloudinaryUploadButton onUpload={handleUpload} />
            </div>
          </div>
        </div>

        <div className="col-span-2 pt-4 border-t flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </form>
  );
}
