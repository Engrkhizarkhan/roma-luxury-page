import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { requireAdminPage } from "@/lib/auth";
import { getDashboardData } from "@/services/dashboard";

export const metadata: Metadata = {
  title: "Operations dashboard",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export default async function AdminPage() {
  const session = await requireAdminPage();
  const data = await getDashboardData();
  return <AdminDashboard initialData={data} username={session.username} />;
}
