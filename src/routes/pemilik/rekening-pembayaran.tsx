import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerBankAccounts from "~/pages/owner/OwnerBankAccounts";

export default function OwnerBankAccountsRoute() {
  return (
    <DashboardLayout
      title="Rekening Pembayaran"
      subtitle="Kelola rekening pembayaran yang digunakan oleh penyewa."
    >
      <OwnerBankAccounts />
    </DashboardLayout>
  );
}
