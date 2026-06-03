'use client'
import { useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SignInCard from "@/components/ui/SignInCard";
import SignUpCard from "@/components/ui/SignUpCard";
import SignInCTA from "@/components/ui/SignInCTA";

function AuthForms() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const mode = searchParams.get('mode');
    const isSignIn = mode !== 'signup' && mode !== 'register';

    const [accountType, setAccountType] = useState<"buy" | "sell">("buy");

    const switchMode = (newMode: 'login' | 'signup') => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('mode', newMode);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <>
            <div className="w-full max-w-md">
                {isSignIn ? (
                    <div className="flex flex-col gap-2">
                        <SignInCard />
                        <div className="text-sm text-center mt-2">
                            <span className="text-gray-600">Don't have an account? </span>
                            <button onClick={() => switchMode('signup')} className="text-[#F26419] font-bold hover:underline">
                                Sign up
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <SignUpCard accountType={accountType} setAccountType={setAccountType} />
                        <div className="text-sm text-center mt-2">
                            <span className="text-gray-600">Already have an account? </span>
                            <button onClick={() => switchMode('login')} className="text-[#F26419] font-bold hover:underline">
                                Sign in
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full max-w-md hidden md:block">
                <SignInCTA accountType={isSignIn ? "buy" : accountType} />
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