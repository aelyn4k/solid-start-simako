import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerFacilities from "~/pages/owner/OwnerFacilities";

export default function OwnerFacilitiesRoute() {
  return (
    <DashboardLayout
      title="Fasilitas Umum"
      subtitle="Kelola fasilitas umum yang tersedia di kost milik akun ini."
    >
      <OwnerFacilities />
    </DashboardLayout>
  );
}
