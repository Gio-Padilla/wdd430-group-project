import SignInCard from "@/components/ui/SignInCard";
import SignInCTA from "@/components/ui/SignInCTA";

export default function AccountPage() {
    return (
        <div className="w-full bg-background grid place-items-center grid-cols-2 p-5">
            <SignInCard />
            <SignInCTA />
        </div>
    );
}