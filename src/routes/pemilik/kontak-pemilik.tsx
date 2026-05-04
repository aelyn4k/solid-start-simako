import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerContactPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerContactRoute() {
  return (
    <OwnerSidebar
      title="Kontak Pemilik"
      subtitle="Kelola informasi kontak pemilik yang aktif untuk kost ini."
    >
      <OwnerContactPage />
    </OwnerSidebar>
  );
}
