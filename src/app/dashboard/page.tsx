import Link from "next/link";

export default function DashboardPage() {
    return (
        <div>
            <h1>Dashboard Page</h1>
            <Link href="/dashboard/products">Click here to view and manage your products</Link>
        </div>
    );
}