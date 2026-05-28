'use client'

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function ToastContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (error === 'unauthorized_dashboard') {
            const timer1 = setTimeout(() => setShowToast(true), 150);
            const timer2 = setTimeout(() => setShowToast(false), 5000);
            return () => { clearTimeout(timer1); clearTimeout(timer2); };
        }
    }, [error]);

    return (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-12 scale-90 pointer-events-none'}`}>
            <div className="bg-[#F26419] text-white px-6 py-4 rounded-2xl shadow-[0_20px_50px_-12px_rgba(242,100,25,0.6)] font-medium flex items-center gap-3 border border-white/20 backdrop-blur-md">
                <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span className="text-[15px] tracking-wide">Access Denied. Please sign in as a seller first.</span>
            </div>
        </div>
    );
}

export default function GlobalToast() {
    return (
        <Suspense fallback={null}>
            <ToastContent />
        </Suspense>
    );
}
