import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // If the user is not logged in, redirect them to the login page with an error
  if (!session) {
    redirect("/account?mode=login&error=unauthorized_dashboard");
  }

  // If the user is logged in but is not a seller, redirect them to the home page with an error
  if ((session.user as any).role !== "seller") {
    redirect("/?error=unauthorized_dashboard");
  }

  return <>{children}</>;
}
