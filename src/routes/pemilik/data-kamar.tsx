import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerRooms from "~/pages/owner/OwnerRooms";

export default function OwnerRoomsRoute() {
  return (
    <DashboardLayout
      title="Data Kamar"
      subtitle="Kelola kamar milik akun pemilik kost yang sedang login."
    >
      <OwnerRooms />
    </DashboardLayout>
  );
}
