import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerFacilitiesPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerFacilitiesRoute() {
  return (
    <OwnerSidebar
      title="Fasilitas Umum"
      subtitle="Kelola fasilitas umum yang tersedia di kost milik akun ini."
    >
      <OwnerFacilitiesPage />
    </OwnerSidebar>
  );
}
