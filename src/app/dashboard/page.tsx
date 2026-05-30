import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Plus, TrendingUp, Settings, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";

export const dynamic = 'force-dynamic';

async function DashboardStats({ userId }: { userId: string }) {
    const { rows: stats } = await db.query(
        `SELECT 
            COUNT(*) as total_products,
            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_products,
            SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_products
         FROM products WHERE seller_id = $1`,
        [userId]
    );

    const data = stats[0] || { total_products: 0, active_products: 0, draft_products: 0 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <Package size={64} />
                </div>
                <span className="text-gray-500 font-medium text-sm mb-2 relative z-10">Total Products</span>
                <span className="text-4xl font-bold text-gray-900 relative z-10">{data.total_products}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <TrendingUp size={64} />
                </div>
                <span className="text-gray-500 font-medium text-sm mb-2 relative z-10">Active Listings</span>
                <span className="text-4xl font-bold text-green-600 relative z-10">{data.active_products}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                    <Settings size={64} />
                </div>
                <span className="text-gray-500 font-medium text-sm mb-2 relative z-10">Drafts</span>
                <span className="text-4xl font-bold text-orange-500 relative z-10">{data.draft_products}</span>
            </div>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-32 animate-pulse">
                    <div className="h-4 bg-gray-100 rounded w-24 mb-4"></div>
                    <div className="h-10 bg-gray-100 rounded w-16"></div>
                </div>
            ))}
        </div>
    );
}

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user || session.user.role !== 'seller') {
        redirect('/account');
    }

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto w-full">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary opacity-10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight relative z-10">Welcome back, {session.user.name?.split(' ')[0]}!</h1>
                <p className="text-gray-300 max-w-xl text-lg relative z-10">Here's what's happening with your artisan shop today.</p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 font-title tracking-tight">At a Glance</h2>
            <Suspense fallback={<StatsSkeleton />}>
                <DashboardStats userId={session.user.id} />
            </Suspense>

            <div className="my-12 w-full h-px bg-gray-200"></div>

            <h2 className="text-xl font-bold text-gray-900 mb-6 font-title tracking-tight">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <Link href="/dashboard/products/new" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
                    <div className="bg-gray-100 p-3 rounded-lg text-gray-900 group-hover:scale-110 group-hover:bg-gray-900 group-hover:text-white transition-all duration-300">
                        <Plus size={20} />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">Add New Product</div>
                        <div className="text-sm text-gray-500">Create a new listing</div>
                    </div>
                </Link>
                
                <Link href="/dashboard/products" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
                    <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                        <Package size={20} />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">Manage Inventory</div>
                        <div className="text-sm text-gray-500">View and edit products</div>
                    </div>
                </Link>

                <Link href="/" className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group">
                    <div className="bg-gray-50 p-3 rounded-lg text-gray-700 group-hover:scale-110 group-hover:bg-gray-200 transition-all duration-300">
                        <ExternalLink size={20} />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">View Storefront</div>
                        <div className="text-sm text-gray-500">See your public profile</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}