'use client'
import { useState } from "react";
import SignInCard from "@/components/ui/SignInCard";
import SignUpCard from "@/components/ui/SignUpCard";
import SignInCTA from "@/components/ui/SignInCTA";

export default function AccountPage() {
    const [isSignIn, setIsSignIn] = useState(true);
    const [accountType, setAccountType] = useState<"buy" | "sell">("buy");

    return (
        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                gap-6
                bg-background
                p-5
                md:flex-row
                min-h-[80vh]
            "
        >
            <div className="w-full max-w-md">
                {isSignIn ? (
                    <div className="flex flex-col gap-2">
                        <SignInCard />
                        <div className="text-sm text-center mt-2">
                            <span className="text-gray-600">Don't have an account? </span>
                            <button onClick={() => setIsSignIn(false)} className="text-primary font-medium hover:underline">
                                Sign up
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <SignUpCard accountType={accountType} setAccountType={setAccountType} />
                        <div className="text-sm text-center mt-2">
                            <span className="text-gray-600">Already have an account? </span>
                            <button onClick={() => setIsSignIn(true)} className="text-primary font-medium hover:underline">
                                Sign in
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="w-full max-w-md hidden md:block">
                <SignInCTA accountType={isSignIn ? "buy" : accountType} />
            </div>
        </div>
    );
}