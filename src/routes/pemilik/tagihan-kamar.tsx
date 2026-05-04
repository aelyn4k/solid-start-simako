import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerRoomBillsPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerRoomBillsRoute() {
  return (
    <OwnerSidebar
      title="Tagihan Kamar"
      subtitle="Kelola jadwal dan status tagihan kamar milik akun pemilik."
    >
      <OwnerRoomBillsPage />
    </OwnerSidebar>
  );
}
