"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { Trash2, Edit2, Star, CheckSquare, Square, Package } from "lucide-react";
import Link from "next/link";

type Review = {
    id: number;
    product_id: number;
    rating: number;
    comment: string;
    created_at: string;
    product_title: string;
    product_image: string;
};

type GroupedProduct = {
    product_id: number;
    product_title: string;
    product_image: string;
    reviews: Review[];
};

type GroupedReviewsProps = {
    groupedReviews: GroupedProduct[];
};

export default function GroupedReviews({ groupedReviews: initialGrouped }: GroupedReviewsProps) {
    const router = useRouter();
    const [groupedReviews, setGroupedReviews] = useState<GroupedProduct[]>(initialGrouped);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    
    // Edit Modal State
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSelect = (id: number) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleSelectProductGroup = (product: GroupedProduct) => {
        const productReviewIds = product.reviews.map(r => r.id);
        const allSelected = productReviewIds.every(id => selectedIds.has(id));
        
        const next = new Set(selectedIds);
        if (allSelected) {
            productReviewIds.forEach(id => next.delete(id));
        } else {
            productReviewIds.forEach(id => next.add(id));
        }
        setSelectedIds(next);
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;
        setIsDeleting(true);
        
        try {
            const res = await fetch("/api/reviews", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewIds: Array.from(selectedIds) })
            });

            if (!res.ok) throw new Error("Failed to delete reviews");

            // Filter out deleted reviews
            const updatedGrouped = groupedReviews.map(group => ({
                ...group,
                reviews: group.reviews.filter(r => !selectedIds.has(r.id))
            })).filter(group => group.reviews.length > 0);

            setGroupedReviews(updatedGrouped);
            setSelectedIds(new Set());
            setIsDeleteModalOpen(false);
            toast.success("Reviews deleted successfully!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while deleting reviews");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingReview || !editComment.trim()) return;
        setIsSaving(true);

        try {
            const res = await fetch("/api/reviews", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reviewId: editingReview.id,
                    rating: editRating,
                    comment: editComment
                })
            });

            if (!res.ok) throw new Error("Failed to update review");

            const updatedGrouped = groupedReviews.map(group => ({
                ...group,
                reviews: group.reviews.map(r => 
                    r.id === editingReview.id 
                        ? { ...r, rating: editRating, comment: editComment } 
                        : r
                )
            }));
            
            setGroupedReviews(updatedGrouped);
            setEditingReview(null);
            toast.success("Review updated successfully!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Failed to update review");
        } finally {
            setIsSaving(false);
        }
    };

    const openEditModal = (review: Review) => {
        setEditingReview(review);
        setEditRating(review.rating);
        setEditComment(review.comment);
    };

    if (groupedReviews.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center">
                <Package className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No reviews yet</h3>
                <p className="text-gray-500 mt-2 max-w-sm">You haven't left any reviews. Once you buy and review a product, it will appear here!</p>
                <Link href="/" className="mt-6 px-6 py-2 bg-[#2F4F4F] text-white font-bold rounded-lg hover:bg-[#1a2e2e] transition">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Action Bar */}
            {selectedIds.size > 0 && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 flex justify-between items-center sticky top-24 z-10 animate-fade-in">
                    <span className="font-semibold text-[#F26419]">
                        {selectedIds.size} review{selectedIds.size > 1 ? 's' : ''} selected
                    </span>
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Selected
                    </button>
                </div>
            )}

            {/* Product Groups */}
            {groupedReviews.map(group => {
                const groupReviewIds = group.reviews.map(r => r.id);
                const allSelected = groupReviewIds.every(id => selectedIds.has(id));
                const someSelected = groupReviewIds.some(id => selectedIds.has(id));

                return (
                    <div key={group.product_id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Product Header */}
                        <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-4">
                            <button onClick={() => toggleSelectProductGroup(group)} className="text-gray-400 hover:text-[#F26419] transition">
                                {allSelected ? <CheckSquare className="w-5 h-5 text-[#F26419]" /> : 
                                 someSelected ? <div className="w-5 h-5 rounded-[4px] border-2 border-[#F26419] bg-[#F26419] flex items-center justify-center"><div className="w-2.5 h-[2px] bg-white rounded-full"/></div> :
                                 <Square className="w-5 h-5" />}
                            </button>
                            <div className="w-12 h-12 relative rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                                <Image src={group.product_image || '/products/placeholder.jpg'} alt={group.product_title} fill className="object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{group.product_title}</h3>
                                <Link href={`/products/${group.product_id}`} className="text-sm text-[#F26419] hover:underline font-medium">View Product →</Link>
                            </div>
                        </div>

                        {/* Reviews List */}
                        <div className="divide-y divide-gray-50">
                            {group.reviews.map(review => (
                                <div key={review.id} className={`p-4 pl-12 flex gap-4 transition-colors ${selectedIds.has(review.id) ? 'bg-orange-50/20' : 'hover:bg-gray-50/50'}`}>
                                    <button onClick={() => toggleSelect(review.id)} className="mt-1 text-gray-300 hover:text-[#F26419] flex-shrink-0 transition">
                                        {selectedIds.has(review.id) ? <CheckSquare className="w-5 h-5 text-[#F26419]" /> : <Square className="w-5 h-5" />}
                                    </button>
                                    
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1 mb-1.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-3.5 h-3.5 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                                                />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-2 font-medium">
                                                {new Date(review.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed text-[15px]">{review.comment}</p>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => openEditModal(review)}
                                            className="p-2 text-gray-400 hover:text-[#2F4F4F] hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Edit Review"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingReview}
                onClose={() => setEditingReview(null)}
                title="Edit Review"
                actionButton={
                    <button
                        onClick={handleSaveEdit}
                        disabled={isSaving}
                        className="px-4 py-2 font-bold text-white bg-[#2F4F4F] hover:bg-[#1a2e2e] rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setEditRating(star)}
                                    className="focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= editRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-gray-300'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                        <textarea
                            value={editComment}
                            onChange={(e) => setEditComment(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F] outline-none resize-none"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Reviews"
                description={`Are you sure you want to delete ${selectedIds.size} selected review(s)? This cannot be undone.`}
                actionButton={
                    <button
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                        Yes, Delete
                    </button>
                }
            >
                <p className="text-gray-600 mt-2">These reviews will be permanently removed from the products.</p>
            </Modal>
        </div>
    );
}
