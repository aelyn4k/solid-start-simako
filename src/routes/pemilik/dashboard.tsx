import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerDashboard from "~/pages/owner/OwnerDashboard";

export default function OwnerDashboardRoute() {
  return (
    <DashboardLayout
      title="Dashboard Pemilik Kost"
      subtitle="Ringkasan data kost yang terhubung dengan akun pemilik login."
    >
      <OwnerDashboard />
    </DashboardLayout>
  );
}
