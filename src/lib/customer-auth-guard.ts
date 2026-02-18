import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Server-side auth guard for customer dashboard pages.
 * Redirects to /dashboard/login if not authenticated or not a customer.
 * Returns the session if valid.
 */
export async function requireCustomerAuth() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/dashboard/login");
  }

  if (session.user.role !== "customer") {
    redirect("/dashboard/login");
  }

  return session;
}
