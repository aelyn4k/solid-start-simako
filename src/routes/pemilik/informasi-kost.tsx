import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerKostInfo from "~/pages/owner/OwnerKostInfo";

export default function OwnerKostInfoRoute() {
  return (
    <DashboardLayout
      title="Informasi Kost"
      subtitle="Kelola alamat kost dan link Google Maps sesuai akun pemilik."
    >
      <OwnerKostInfo />
    </DashboardLayout>
  );
}
