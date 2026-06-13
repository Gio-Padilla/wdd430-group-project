import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { InstagramIcon, FacebookIcon, TwitterIcon, GlobeIcon, WhatsAppIcon, TikTokIcon } from "@/components/ui/SocialIcons";

type ArtisanProduct = {
    id: number;
    title: string;
    image: string;
};

type Artisan = {
    id: number;
    name: string;
    bio: string;
    location: string;
    avatarUrl: string | null;
    bannerColor?: string | null;
    socialLinks?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
        website?: string;
        whatsapp?: string;
        tiktok?: string;
    } | null;
    products: ArtisanProduct[];
};

export default function ArtisanCard({ artisan }: { artisan: Artisan }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
            {/* Header / Avatar Section */}
            <div 
                className="relative h-24 sm:h-32 bg-gray-200" 
                style={{ backgroundColor: artisan.bannerColor || undefined }}
            >
                <div className="absolute -bottom-10 left-6">
                    <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden relative">
                        {artisan.avatarUrl ? (
                            <Image
                                src={artisan.avatarUrl}
                                alt={artisan.name}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl">
                                {artisan.name.charAt(0)}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info Section */}
            <div className="pt-12 px-6 pb-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                        <Link href={`/sellers/${artisan.id}`}>
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-[#F26419] transition-colors">
                                {artisan.name}
                            </h2>
                        </Link>
                        {artisan.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{artisan.location}</span>
                            </div>
                        )}
                    </div>
                    {artisan.socialLinks && (
                        <div className="flex gap-2 text-gray-400">
                            {artisan.socialLinks.instagram && (
                                <a href={artisan.socialLinks.instagram} target="_blank" rel="noreferrer" className="hover:text-[#F26419]">
                                    <InstagramIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            )}
                            {artisan.socialLinks.whatsapp && (
                                <a href={artisan.socialLinks.whatsapp} target="_blank" rel="noreferrer" className="hover:text-[#F26419]">
                                    <WhatsAppIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            )}
                            {artisan.socialLinks.tiktok && (
                                <a href={artisan.socialLinks.tiktok} target="_blank" rel="noreferrer" className="hover:text-[#F26419]">
                                    <TikTokIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            )}
                            {artisan.socialLinks.facebook && (
                                <a href={artisan.socialLinks.facebook} target="_blank" rel="noreferrer" className="hover:text-[#F26419]">
                                    <FacebookIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            )}
                            {artisan.socialLinks.twitter && (
                                <a href={artisan.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-[#F26419]">
                                    <TwitterIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            )}
                            {artisan.socialLinks.website && (
                                <a href={artisan.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-[#F26419]">
                                    <GlobeIcon className="w-5 h-5 sm:w-4 sm:h-4" />
                                </a>
                            )}
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                    {artisan.bio || "This artisan hasn't provided a bio yet."}
                </p>

                {/* Product Sneak Peek */}
                {artisan.products && artisan.products.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-gray-50">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            Latest Creations
                        </p>
                        <div className="flex gap-2">
                            {artisan.products.slice(0, 3).map((prod) => (
                                <Link 
                                    key={prod.id} 
                                    href={`/products/${prod.id}`}
                                    className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors"
                                >
                                    <Image
                                        src={prod.image || "/products/placeholder.jpg"}
                                        alt={prod.title}
                                        fill
                                        sizes="80px"
                                        className="object-cover"
                                    />
                                </Link>
                            ))}
                            {artisan.products.length > 3 && (
                                <Link 
                                    href={`/sellers/${artisan.id}`}
                                    className="flex-1 min-w-[64px] rounded-lg bg-gray-50 border border-gray-100 flex flex-col items-center justify-center text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                >
                                    <span>+{artisan.products.length - 3}</span>
                                    <span>more</span>
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6">
                    <Link
                        href={`/sellers/${artisan.id}`}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gray-50 hover:bg-[#2F4F4F] text-[#2F4F4F] hover:text-white rounded-xl font-semibold transition-all duration-300"
                    >
                        View Storefront
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
