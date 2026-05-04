import OwnerSidebar from "~/components/layout/OwnerSidebar";
import OwnerDashboard from "~/pages/owner/OwnerDashboard";

export default function OwnerDashboardRoute() {
  return (
    <OwnerSidebar
      title="Dashboard Pemilik Kost"
      subtitle="Ringkasan data kost yang terhubung dengan akun pemilik login."
    >
      <OwnerDashboard />
    </OwnerSidebar>
  );
}
