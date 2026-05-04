import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerKostInfoPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerKostInfoRoute() {
  return (
    <OwnerSidebar
      title="Informasi Kost"
      subtitle="Kelola alamat kost dan link Google Maps sesuai akun pemilik."
    >
      <OwnerKostInfoPage />
    </OwnerSidebar>
  );
}
