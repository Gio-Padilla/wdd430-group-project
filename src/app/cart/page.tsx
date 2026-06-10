import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Image from "next/image";
import RemoveFromCartButton from "@/components/cart/RemoveFromCartButton";

export default async function CartPage() {

    const session = await auth();

    if (!session?.user) {
        redirect("/account");
    }

    const userId = Number(session.user.id);

    const result = await db.query(
        `
        SELECT
            c.id,
            c.quantity,

            p.id AS product_id,
            p.title,
            p.price,

            (
                SELECT url
                FROM product_images
                WHERE product_id = p.id
                AND is_primary = true
                LIMIT 1
            ) AS image

        FROM cart_items c

        INNER JOIN products p
            ON p.id = c.product_id

        WHERE c.user_id = $1

        ORDER BY c.created_at DESC
        `,
        [userId]
    );

    const items = result.rows;

    const total = items.reduce(
        (sum, item) =>
            sum +
            Number(item.price) *
            Number(item.quantity),
        0
    );

    return (
        <main className="max-w-6xl mx-auto p-6">

            <h1 className="text-4xl font-bold text-[#2F4F4F] mb-8">
                Shopping Cart
            </h1>

            {items.length === 0 ? (
                <div className="bg-[#DCDCDC] border-2 border-black rounded-xl p-8 text-center">
                    <p className="text-[#2F4F4F] font-medium">
                        Your cart is empty.
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">

                        {items.map((item) => (

                            <div
                                key={item.id}
                                className="border rounded-xl p-4 flex gap-4 items-center"
                            >
                                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">

                                    <Image
                                        src={
                                            item.image ||
                                            "/products/placeholder.jpg"
                                        }
                                        alt={item.title}
                                        fill
                                        className="object-contain"
                                    />

                                </div>

                                <div className="flex-1">

                                    <h2 className="font-semibold text-lg">
                                        {item.title}
                                    </h2>

                                    <p className="text-gray-600">
                                        Quantity: {item.quantity}
                                    </p>

                                    <p className="text-[#F26419] font-semibold">
                                        $
                                        {(
                                            Number(item.price) *
                                            Number(item.quantity)
                                        ).toFixed(2)}
                                    </p>

                                </div>

                                <div>
                                    <RemoveFromCartButton
                                        cartItemId={item.id}
                                    />
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="mt-8 border-t pt-6">

                        <div className="flex justify-between items-center">

                            <h2 className="text-2xl font-bold">
                                Total
                            </h2>

                            <p className="text-3xl font-bold text-[#F26419]">
                                ${total.toFixed(2)}
                            </p>

                        </div>

                        <button
                            className="mt-6 w-full bg-[#F26419] hover:bg-[#d95412] text-white py-4 rounded-lg font-semibold transition-colors"
                        >
                            Proceed to Checkout
                        </button>

                    </div>
                </>
            )}

        </main>
    );
}