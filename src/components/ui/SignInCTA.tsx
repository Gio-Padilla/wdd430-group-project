import { Scissors, Heart, Package } from "lucide-react"



export default function SignInCTA({ accountType = "buy" }: { accountType?: "buy" | "sell" }) {
    return (
        <div className="w-full h-full bg-primary/95 p-8 flex flex-col gap-8 rounded-xl">

            {/* Brand mark */}
            <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-accent" />
                <span className="text-xs font-medium tracking-widest uppercase text-background">
                    Handcrafted Haven
                </span>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-3">
                <h2 className="text-3xl font-medium text-background leading-snug">
                    {accountType === "sell" ? (
                        <>Reach a global audience.<br /><span className="text-accent">Grow your business.</span></>
                    ) : (
                        <>Made with care.<br /><span className="text-accent">Delivered with love.</span></>
                    )}
                </h2>
                <p className="text-sm text-background/60 leading-relaxed">
                    {accountType === "sell" 
                        ? "Join our marketplace of artisans and turn your passion into profit." 
                        : "Discover unique, handcrafted treasures from independent makers around the world."}
                </p>
            </div>

            {/* Perks */}
            <ul className="flex flex-col gap-3">
                {(accountType === "sell" ? [
                    { icon: Package, label: "Easy product listing & management" },
                    { icon: Heart, label: "Connect with passionate buyers" },
                    { icon: Scissors, label: "Seller tools designed for artisans" },
                ] : [
                    { icon: Scissors, label: "Every piece is one-of-a-kind" },
                    { icon: Heart, label: "Support independent artisans" },
                    { icon: Package, label: "Thoughtfully packaged & shipped" },
                ]).map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-accent shrink-0" />
                        <span className="text-sm text-background">{label}</span>
                    </li>
                ))}
            </ul>

            {/* Social proof */}
            <div className="border-t border-background/20 pt-5 flex items-center gap-3">
                <div className="flex">
                    {[
                        { initial: "A", bg: "bg-accent" },
                        { initial: "M", bg: "bg-blue" },
                        { initial: "R", bg: "bg-accent" },
                    ].map(({ initial, bg }, i) => (
                        <div
                            key={initial}
                            className={`w-7 h-7 rounded-full ${bg} border-2 border-primary flex items-center justify-center text-[11px] font-medium text-background`}
                            style={{ marginLeft: i > 0 ? "-8px" : "0" }}
                        >
                            {initial}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-background/60 leading-snug">
                    Join <span className="text-background font-medium">{accountType === "sell" ? "500+" : "2,400+"}</span> {accountType === "sell" ? "artisans" : "collectors"} already inside
                </p>
            </div>

        </div>
    )
}