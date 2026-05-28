'use client'
import { useState } from "react";
import { registerAction, loginAction } from "@/actions/auth";
import { Eye, EyeOff, User, Mail, Lock, Store, ShoppingBag } from "lucide-react";

export default function SignUpCard({ accountType, setAccountType }: { accountType: "buy" | "sell", setAccountType: (type: "buy" | "sell") => void }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const result = await registerAction({ email, password, fullName, accountType });
        if (result?.error) {
            setError(result.error);
            return;
        }

        // Auto login after successful registration
        const loginResult = await loginAction({ email, password });
        if (loginResult?.error) {
            setError(loginResult.error);
        }
    }

    return (
        <div className="w-full p-2 flex flex-col gap-6">
            <div>
                <h2 className="text-2xl font-bold uppercase text-gray-900 tracking-wide">Sign Up</h2>
                <p className="text-base text-gray-600 mt-1">Create an account to get started</p>
            </div>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}
            <form className="text-base flex p-4 flex-col gap-6 w-full" onSubmit={(e) => handleSignUp(e)}>
                <div className="grid gap-2">
                    <label className="font-semibold text-gray-900">I want to</label>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setAccountType("buy")}
                            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                                accountType === "buy" 
                                ? "border-2 border-gray-900 text-gray-900" 
                                : "border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-800"
                            }`}
                        >
                            <ShoppingBag className="mb-2" size={24} />
                            <span className="font-semibold text-base">Buy</span>
                            <span className="text-xs font-medium text-center">Shop handmade</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setAccountType("sell")}
                            className={`flex-1 flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                                accountType === "sell" 
                                ? "border-2 border-gray-900 text-gray-900" 
                                : "border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-800"
                            }`}
                        >
                            <Store className="mb-2" size={24} />
                            <span className="font-semibold text-base">Sell</span>
                            <span className="text-xs font-medium text-center">List products</span>
                        </button>
                    </div>
                </div>

                <div className="grid gap-1">
                    <label htmlFor="fullName" className="font-semibold text-gray-900">FULL NAME</label>
                    <div className="relative flex items-center">
                        <User className="absolute left-2 text-gray-500" size={18} />
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Your full name"
                            className="bg-background px-8 py-2 border-b border-gray-400 text-gray-900 font-medium placeholder:text-gray-500 focus:border-primary outline-none transition-colors w-full"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-1">
                    <label htmlFor="email" className="font-semibold text-gray-900">EMAIL ADDRESS</label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-2 text-gray-500" size={18} />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            className="bg-background px-8 py-2 border-b border-gray-400 text-gray-900 font-medium placeholder:text-gray-500 focus:border-primary outline-none transition-colors w-full"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-1">
                    <label htmlFor="password" className="font-semibold text-gray-900">PASSWORD</label>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-2 text-gray-500" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a strong password"
                            className="bg-background px-8 py-2 border-b border-gray-400 text-gray-900 font-medium placeholder:text-gray-500 focus:border-primary outline-none transition-colors w-full pr-8"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="grid gap-1">
                    <label htmlFor="confirmPassword" className="font-semibold text-gray-900">CONFIRM PASSWORD</label>
                    <div className="relative flex items-center">
                        <Lock className="absolute left-2 text-gray-500" size={18} />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            className="bg-background px-8 py-2 border-b border-gray-400 text-gray-900 font-medium placeholder:text-gray-500 focus:border-primary outline-none transition-colors w-full pr-8"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <input type="submit" value="Create Account" className="bg-primary text-background font-semibold hover:bg-primary/90 px-4 py-3 rounded-md cursor-pointer mt-2 transition-colors" />
            </form>
        </div>
    )
}

