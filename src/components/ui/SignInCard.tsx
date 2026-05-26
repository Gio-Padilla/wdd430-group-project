'use client'
import { useState } from "react";
// Finish the sign in card with the logo and title, then we can add the form elements in the next step
export default function SignInCard() {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    // const [error, setError] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here, such as making an API call to authenticate the user
        console.log("Email:", email);
        console.log("Password:", password);
    }

    return (
        <div className="w-full p-7 flex flex-col gap-4">
            <div>
                <h2 className="text-md">Sign In</h2>
                <p className="text-sm font-light">Enter your credentials to continue</p>
            </div>
            <form className="text-sm flex p-10 flex-col gap-6 w-full" onSubmit={(e) => handleLogin(e)}>
                <div className="grid gap-1">
                    <label htmlFor="email">EMAIL</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="bg-background px-2 py-1 border-b"
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="grid">
                    <label htmlFor="password">PASSWORD</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="bg-background px-2 py-1 border-b"
                        required
                        autoComplete="current-password"
                    />
                </div>
                <input type="submit" value="Sign In" className="bg-primary text-background hover:bg-primary/90 px-4 py-2 rounded-md" />
            </form>
            {/* forgot password */}\
            <div className="text-sm text-center">
                <a href="#" className="text-primary hover:underline">
                    Forgot your password?
                </a>
            </div>
        </div>
    )
}