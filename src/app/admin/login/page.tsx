import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { getAdminSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Administrator sign in",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function LoginPage() {
  if (await getAdminSession()) redirect("/admin");
  return <AdminLogin />;
}
