import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerComplaints from "~/pages/owner/OwnerComplaints";

export default function OwnerTenantComplaintsRoute() {
  return (
    <DashboardLayout
      title="Keluhan Penyewa"
      subtitle="Pantau dan proses keluhan dari penyewa yang tinggal di kamar milik akun ini."
    >
      <OwnerComplaints />
    </DashboardLayout>
  );
}
