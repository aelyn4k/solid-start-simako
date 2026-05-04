import OwnerSidebar from "~/components/layout/OwnerSidebar";
import { OwnerBankAccountsPage } from "~/pages/owner/OwnerManagementPages";

export default function OwnerBankAccountsRoute() {
  return (
    <OwnerSidebar
      title="Rekening Pembayaran"
      subtitle="Kelola rekening pembayaran yang digunakan oleh penyewa."
    >
      <OwnerBankAccountsPage />
    </OwnerSidebar>
  );
}
