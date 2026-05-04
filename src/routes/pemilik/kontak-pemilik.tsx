import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerContact from "~/pages/owner/OwnerContact";

export default function OwnerContactRoute() {
  return (
    <DashboardLayout
      title="Kontak Pemilik"
      subtitle="Kelola informasi kontak pemilik yang aktif untuk kost ini."
    >
      <OwnerContact />
    </DashboardLayout>
  );
}
