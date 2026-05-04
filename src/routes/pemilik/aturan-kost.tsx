import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerRulesPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerRulesRoute() {
  return (
    <OwnerSidebar
      title="Aturan Kost"
      subtitle="Kelola aturan penyewa untuk kost milik akun ini."
    >
      <OwnerRulesPage />
    </OwnerSidebar>
  );
}
