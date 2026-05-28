import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not logged in, redirect them to the login page
  if (!session) {
    redirect("/account");
  }

  // If the user is logged in but is not a seller, redirect them to the home page
  if ((session.user as any).role !== "seller") {
    redirect("/");
  }

  return <>{children}</>;
}
