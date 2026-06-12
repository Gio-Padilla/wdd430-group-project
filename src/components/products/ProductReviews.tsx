"use client";

import { useState } from "react";
import { Star, Trash2, Edit2, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { useRouter } from "next/navigation";

type Review = {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    name: string;
    user_id: number;
};

type ProductReviewsProps = {
    productId: number;
    initialReviews: Review[];
    sessionUser: any;
    reviewCount: number;
};

export default function ProductReviews({ productId, initialReviews, sessionUser, reviewCount }: ProductReviewsProps) {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // New Review Form
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [showNewReviewForm, setShowNewReviewForm] = useState(false);

    // Edit Modal State
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [editRating, setEditRating] = useState(5);
    const [editComment, setEditComment] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Delete Modal State
    const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const isBuyer = sessionUser?.role === "buyer";

    const handleCreateReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return toast.error("Please enter a comment");
        
        setIsSubmitting(true);
        const toastId = toast.loading("Submitting review...");
        
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, rating: newRating, comment: newComment })
            });

            if (!res.ok) throw new Error("Failed to submit review");

            const { review } = await res.json();
            
            // Format the returned review to match our type
            const addedReview: Review = {
                ...review,
                name: sessionUser.name,
                user_id: Number(sessionUser.id)
            };

            setReviews([addedReview, ...reviews]);
            setNewComment("");
            setNewRating(5);
            setShowNewReviewForm(false);
            toast.success("Review submitted successfully!", { id: toastId });
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while submitting", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingReviewId) return;
        setIsDeleting(true);
        
        try {
            const res = await fetch("/api/reviews", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reviewIds: [deletingReviewId] })
            });

            if (!res.ok) throw new Error("Failed to delete review");

            setReviews(reviews.filter(r => r.id !== deletingReviewId));
            setDeletingReviewId(null);
            toast.success("Review deleted successfully!");
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("An error occurred while deleting review");
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

            setReviews(reviews.map(r => 
                r.id === editingReview.id 
                    ? { ...r, rating: editRating, comment: editComment } 
                    : r
            ));
            
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

    return (
        <section className="mt-10 sm:mt-14">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-2xl font-bold text-[#2F4F4F]">
                    Reviews ({reviews.length})
                </h2>

                {!sessionUser ? (
                    <Link
                        href="/account"
                        className="inline-flex items-center justify-center gap-2 bg-[#2F4F4F] hover:bg-[#F26419] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300"
                    >
                        Sign In to Review
                    </Link>
                ) : isBuyer ? (
                    <button
                        onClick={() => setShowNewReviewForm(!showNewReviewForm)}
                        className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                            showNewReviewForm 
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
                            : 'bg-[#2F4F4F] hover:bg-[#F26419] text-white'
                        }`}
                    >
                        {showNewReviewForm ? 'Cancel' : 'Write a Review'}
                    </button>
                ) : null}
            </div>

            {/* Inline Review Form */}
            {showNewReviewForm && (
                <div className="bg-white p-6 rounded-2xl border border-[#F26419]/20 shadow-[0_4px_20px_-10px_rgba(242,100,25,0.2)] mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-[#F26419]" />
                        Rate this product
                    </h3>
                    <form onSubmit={handleCreateReview} className="space-y-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    onClick={() => setNewRating(star)}
                                    className="focus:outline-none hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-yellow-200'
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                        <div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                placeholder="Share your experience with this product..."
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F26419] focus:border-transparent outline-none resize-none transition-all"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || !newComment.trim()}
                                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F26419] hover:bg-[#d65511] text-white font-bold rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {reviews.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-sm">
                    <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        No reviews yet. Be the first to share your thoughts!
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => {
                        const isOwnReview = sessionUser && Number(sessionUser.id) === review.user_id;
                        
                        return (
                            <div
                                key={review.id}
                                className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm transition-colors ${isOwnReview ? 'border-[#2F4F4F]/20' : 'border-gray-200'}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#2F4F4F] flex items-center justify-center text-white font-bold text-sm">
                                            {review.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                                                {review.name}
                                                {isOwnReview && <span className="bg-[#2F4F4F]/10 text-[#2F4F4F] text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">You</span>}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {new Date(review.created_at).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-4 h-4 ${
                                                    i < review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "text-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-gray-700 leading-relaxed pl-13">
                                    {review.comment}
                                </p>

                                {isOwnReview && (
                                    <div className="flex items-center gap-2 mt-4 pl-13">
                                        <button 
                                            onClick={() => openEditModal(review)}
                                            className="text-xs font-semibold text-gray-500 hover:text-[#2F4F4F] flex items-center gap-1 transition-colors bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" /> Edit
                                        </button>
                                        <button 
                                            onClick={() => setDeletingReviewId(review.id)}
                                            className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md border border-red-100"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

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
                                    className="focus:outline-none hover:scale-110 transition-transform"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${
                                            star <= editRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 hover:text-yellow-200'
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F26419] outline-none resize-none"
                        />
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deletingReviewId}
                onClose={() => setDeletingReviewId(null)}
                title="Delete Review"
                description={`Are you sure you want to delete this review? This cannot be undone.`}
                actionButton={
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                        Yes, Delete
                    </button>
                }
            >
                <p className="text-gray-600 mt-2">This review will be permanently removed from the product.</p>
            </Modal>
        </section>
    );
}
