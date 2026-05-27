import SignInCard from "@/components/ui/SignInCard";
import SignInCTA from "@/components/ui/SignInCTA";

export default function AccountPage() {
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
            "
        >
            <SignInCard />
            <SignInCTA />
        </div>
    );
}