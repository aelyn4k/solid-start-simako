import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerRules from "~/pages/owner/OwnerRules";

export default function OwnerRulesRoute() {
  return (
    <DashboardLayout
      title="Aturan Kost"
      subtitle="Kelola aturan penyewa untuk kost milik akun ini."
    >
      <OwnerRules />
    </DashboardLayout>
  );
}
