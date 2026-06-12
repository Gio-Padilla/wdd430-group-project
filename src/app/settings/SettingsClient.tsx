"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CloudinaryUploadButton from "@/components/ui/CloudinaryUploadButton";
import Image from "next/image";
import { logoutAction } from "@/lib/actions/auth";
import { toast } from "react-hot-toast";
import Modal from "@/components/ui/Modal";

export default function SettingsClient({ user }: { user: any }) {
    const router = useRouter();
    const isSeller = user.role === "seller";
    const [loading, setLoading] = useState(false);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        avatar_url: user.avatar_url || "",
        banner_color: user.banner_color || "#2F4F4F",
        banner_image_url: user.banner_image_url || "",
        social_links: {
            whatsapp: user.social_links?.whatsapp || "",
            instagram: user.social_links?.instagram || "",
            tiktok: user.social_links?.tiktok || "",
            facebook: user.social_links?.facebook || ""
        }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [e.target.name]: e.target.value
            }
        }));
    };

    const handleAvatarUpload = (result: any) => {
        if (result.info && result.info.secure_url) {
            setFormData(prev => ({ ...prev, avatar_url: result.info.secure_url }));
        }
    };

    const handleBannerUpload = (result: any) => {
        if (result.info && result.info.secure_url) {
            setFormData(prev => ({ ...prev, banner_image_url: result.info.secure_url }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const toastId = toast.loading("Saving changes...");

        try {
            const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to update profile");
            }

            toast.success("Profile updated successfully!", { id: toastId });
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to update profile", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const toastId = toast.loading("Deleting account...");

        try {
            const res = await fetch("/api/profile", { method: "DELETE" });
            if (res.ok) {
                toast.success("Account deleted successfully.", { id: toastId });
                await logoutAction();
            } else {
                toast.error("Failed to delete account", { id: toastId });
                setIsDeleting(false);
            }
        } catch (err) {
            console.error(err);
            toast.error("Error deleting account", { id: toastId });
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
                
                {/* General Settings */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">General Information</h2>
                    <div className="grid grid-cols-1 gap-6">
                        
                        {!isSeller && (
                            <p className="text-sm text-gray-500 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                As a buyer, you can update your name or delete your account. To sell items, please create a seller account.
                            </p>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F] focus:border-transparent"
                            />
                        </div>

                        {isSeller && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Avatar / Profile Photo</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                                            {formData.avatar_url ? (
                                                <Image src={formData.avatar_url} alt="Avatar" fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-gray-400 font-bold text-3xl">
                                                    {formData.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <CloudinaryUploadButton onUpload={handleAvatarUpload} />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F] focus:border-transparent resize-none"
                                        placeholder="Tell buyers a little about yourself and your craft..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F] focus:border-transparent"
                                        placeholder="City, State, or Country"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 bg-[#2F4F4F] hover:bg-[#1a2e2e] text-white font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>

            {isSeller && (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
                    <div className="pt-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Storefront Customization</h2>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                                <p className="text-sm text-gray-500 mb-3">Upload a wide image to display at the top of your seller profile.</p>
                                {formData.banner_image_url && (
                                    <div className="w-full h-32 relative rounded-lg overflow-hidden mb-4 border border-gray-200">
                                        <Image src={formData.banner_image_url} alt="Banner" fill className="object-cover" />
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData(prev => ({...prev, banner_image_url: ""}))}
                                            className="absolute top-2 right-2 bg-white/80 hover:bg-red-50 text-red-600 px-3 py-1 rounded-md text-sm font-semibold transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                {!formData.banner_image_url && (
                                    <CloudinaryUploadButton onUpload={handleBannerUpload} />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Color Fallback</label>
                                <p className="text-sm text-gray-500 mb-2">If no image is uploaded, this color will be used.</p>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        name="banner_color"
                                        value={formData.banner_color}
                                        onChange={handleChange}
                                        className="w-12 h-12 p-1 border border-gray-300 rounded cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 uppercase font-mono">{formData.banner_color}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Social Media Links</h2>
                        <p className="text-sm text-gray-500 mb-4">Add the full URL to your social profiles. Leave blank to hide the icon.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                                <input
                                    type="url"
                                    name="whatsapp"
                                    value={formData.social_links.whatsapp}
                                    onChange={handleSocialChange}
                                    placeholder="https://wa.me/..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                                <input
                                    type="url"
                                    name="instagram"
                                    value={formData.social_links.instagram}
                                    onChange={handleSocialChange}
                                    placeholder="https://instagram.com/..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">TikTok</label>
                                <input
                                    type="url"
                                    name="tiktok"
                                    value={formData.social_links.tiktok}
                                    onChange={handleSocialChange}
                                    placeholder="https://tiktok.com/@..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                                <input
                                    type="url"
                                    name="facebook"
                                    value={formData.social_links.facebook}
                                    onChange={handleSocialChange}
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2F4F4F]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-[#2F4F4F] hover:bg-[#1a2e2e] text-white font-bold rounded-lg shadow-sm transition disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-red-50 rounded-2xl border border-red-100 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-red-700 mb-2">Danger Zone</h2>
                <p className="text-red-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-600 hover:text-white font-bold rounded-lg transition"
                >
                    Delete Account
                </button>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Account"
                description="Are you absolutely sure you want to delete your account? All of your products, reviews, and data will be permanently removed. This action cannot be undone."
                actionButton={
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="px-4 py-2 font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {isDeleting && <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                        Yes, delete my account
                    </button>
                }
            >
                <p className="text-sm text-gray-700 mb-2 bg-red-50 p-3 rounded-lg border border-red-100">
                    <strong>Warning:</strong> You will immediately be logged out and lose access to all your order history.
                </p>
            </Modal>
        </div>
    );
}
