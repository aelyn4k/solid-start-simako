import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerRoomBills from "~/pages/owner/OwnerRoomBills";

export default function OwnerRoomBillsRoute() {
  return (
    <DashboardLayout
      title="Tagihan Kamar"
      subtitle="Kelola jadwal dan status tagihan kamar milik akun pemilik."
    >
      <OwnerRoomBills />
    </DashboardLayout>
  );
}
