'use client'
import { useState, Suspense, useEffect, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SignInCard from "@/components/ui/SignInCard";
import SignUpCard from "@/components/ui/SignUpCard";
import SignInCTA from "@/components/ui/SignInCTA";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/providers/ToastProvider";

function AuthForms() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const mode = searchParams.get('mode');
    const roleParam = searchParams.get('role');
    const isSignIn = mode !== 'signup' && mode !== 'register';
    const { showToast } = useToast();
    const toastShownRef = useRef(false);

    useEffect(() => {
        const error = searchParams.get('error');
        if (error === 'favorites_login' && !toastShownRef.current) {
            toastShownRef.current = true;
            showToast("Please log in to view your favorites.", "error");

            // Remove error from URL so it doesn't trigger again on refresh or remount
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.delete('error');
            router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
        }
    }, [searchParams, showToast, pathname, router]);

    const [accountType, setAccountType] = useState<"buy" | "sell">(roleParam === 'sell' ? 'sell' : 'buy');

    const switchMode = (newMode: 'login' | 'signup') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('mode', newMode);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <div className="w-full max-w-md">
                <AnimatePresence mode="wait">
                    {isSignIn ? (
                        <motion.div 
                            key="login"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-2"
                        >
                            <SignInCard />
                            <div className="text-sm text-center mt-2">
                                <span className="text-gray-600">Don't have an account? </span>
                                <button onClick={() => switchMode('signup')} className="text-[#F26419] font-bold hover:underline">
                                    Sign up
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="signup"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col gap-2"
                        >
                            <SignUpCard accountType={accountType} setAccountType={setAccountType} />
                            <div className="text-sm text-center mt-2">
                                <span className="text-gray-600">Already have an account? </span>
                                <button onClick={() => switchMode('login')} className="text-[#F26419] font-bold hover:underline">
                                    Sign in
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="w-full max-w-md hidden md:block overflow-hidden relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isSignIn ? "loginCTA" : "signupCTA"}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="h-full w-full"
                    >
                        <SignInCTA accountType={isSignIn ? "buy" : accountType} />
                    </motion.div>
                </AnimatePresence>
            </div>
        </>
    );
}

export default function AccountClient() {
    return (
        <div className="flex flex-col items-center justify-center gap-6 bg-background p-5 md:flex-row min-h-[80vh] overflow-hidden relative">
            <Suspense fallback={null}>
                <AuthForms />
            </Suspense>
        </div>
    );
}