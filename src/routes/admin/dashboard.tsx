import Sidebar from "~/components/layout/Sidebar";
import AdminDashboard from "~/pages/admin/AdminDashboard";

export default function AdminDashboardRoute() {
  return (
    <Sidebar
      title="Dashboard Admin"
      subtitle="Ringkasan akun pemilik kost, penyewa, status sistem, dan akses terbaru."
    >
      <AdminDashboard />
    </Sidebar>
  );
}
