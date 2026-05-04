import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerRoomsPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerRoomsRoute() {
  return (
    <OwnerSidebar
      title="Data Kamar"
      subtitle="Kelola kamar milik akun pemilik kost yang sedang login."
    >
      <OwnerRoomsPage />
    </OwnerSidebar>
  );
}
