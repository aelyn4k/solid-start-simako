import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerTenants from "~/pages/owner/OwnerTenants";

export default function OwnerTenantsRoute() {
  return (
    <DashboardLayout
      title="List Penyewa"
      subtitle="Daftar penyewa yang tinggal di kamar milik akun pemilik kost login."
    >
      <OwnerTenants />
    </DashboardLayout>
  );
}
