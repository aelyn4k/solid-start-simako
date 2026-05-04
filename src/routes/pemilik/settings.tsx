import ProtectedRoute from "~/components/ProtectedRoute";
import DashboardLayout from "~/components/layout/DashboardLayout";
import OwnerSettings from "~/pages/owner/OwnerSettings";

export default function OwnerSettingsRoute() {
  return (
    <ProtectedRoute allowedRoles={["pemilik_kost"]}>
      <DashboardLayout
        title="Settings"
        subtitle="Pengaturan keamanan akun pemilik kost."
      >
        <OwnerSettings />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
