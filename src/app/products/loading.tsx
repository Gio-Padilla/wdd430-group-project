export default function Loading() {
    return (
        <main className="p-6 animate-pulse">
            <div className="h-10 w-64 bg-gray-200 rounded-md mb-8"></div>

            {/* FilterBar Skeleton */}
            <div className="mb-6 bg-white border border-gray-100 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center shadow-sm">
                <div className="h-12 w-full md:w-[30%] bg-gray-100 rounded-xl"></div>
                <div className="flex-1 flex flex-wrap md:flex-nowrap gap-4 w-full">
                    <div className="h-12 w-full md:w-1/3 bg-gray-100 rounded-xl"></div>
                    <div className="h-12 w-full md:w-1/3 bg-gray-100 rounded-xl"></div>
                    <div className="h-12 w-full md:w-1/3 bg-gray-100 rounded-xl"></div>
                </div>
            </div>

            {/* ProductGrid Skeleton */}
            <div>
                <div className="h-5 w-32 bg-gray-200 rounded mb-5"></div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                            <div className="w-full aspect-square bg-gray-100"></div>
                            <div className="p-3">
                                <div className="h-4 w-3/4 bg-gray-200 rounded mb-3 mt-1"></div>
                                <div className="flex items-center justify-between mt-1.5">
                                    <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                                    <div className="h-3 w-1/4 bg-gray-100 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
