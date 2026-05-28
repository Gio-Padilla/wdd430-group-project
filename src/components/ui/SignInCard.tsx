'use client'
import { useState } from "react";
import { loginAction } from "@/actions/auth";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// Finish the sign in card with the logo and title, then we can add the form elements in the next step
export default function SignInCard() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        const result = await loginAction({ email, password });
        if (result?.error) {
            setError(result.error);
        }
    }

    return (
        <div className="w-full p-2 flex flex-col gap-4">
            <div>
                <h2 className="text-2xl font-bold uppercase text-gray-900 tracking-wide">Sign In</h2>
                <p className="text-base text-gray-600 mt-1">Enter your credentials to continue</p>
            </div>
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                    {error}
                </div>
            )}
            <form className="text-base flex p-4 flex-col gap-6 w-full" onSubmit={(e) => handleLogin(e)}>
                <div className="grid gap-1">
                    <label htmlFor="email" className="font-semibold text-gray-900">EMAIL</label>
                    <div className="relative flex items-center">
                        <Mail className="absolute left-2 text-gray-500" size={18} />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="bg-background px-8 py-2 border-b border-gray-400 text-gray-900 font-medium placeholder:text-gray-500 focus:border-primary outline-none transition-colors w-full"
                            required
                            autoComplete="email"
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
                            placeholder="Enter your password"
                            className="bg-background px-8 py-2 border-b border-gray-400 text-gray-900 font-medium placeholder:text-gray-500 focus:border-primary outline-none transition-colors w-full pr-10"
                            required
                            autoComplete="current-password"
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
                <input type="submit" value="Sign In" className="bg-primary text-background font-semibold hover:bg-primary/90 px-4 py-3 rounded-md cursor-pointer transition-colors" />
            </form>
            {/* forgot password */}
            <div className="text-sm text-center">
                <a href="#" className="text-primary hover:underline">
                    Forgot your password?
                </a>
            </div>
        </div>
    )
}