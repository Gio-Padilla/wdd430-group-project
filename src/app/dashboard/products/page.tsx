import Link from "next/link";

export default function ProductsPage() {
    return (
        <div>
            <h1>Page to manage the products</h1>
            <Link href="/dashboard/products/new">New Product</Link>
        </div>
    );
}