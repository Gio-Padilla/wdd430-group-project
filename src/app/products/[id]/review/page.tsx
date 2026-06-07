import { redirect } from "next/navigation";
import { auth } from "@/auth";
import ReviewForm from "./review-form";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ReviewPage({ params }: Props) {

    const session = await auth();

    // Not logged in
    if (!session?.user) {
        redirect("/account");
    }

    // Not a buyer
    if (session.user.role !== "buyer") {
        redirect("/");
    }

    const { id } = await params;

    return (
        <main className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">
                Write a Review
            </h1>

            <ReviewForm productId={id} />
        </main>
    );
}