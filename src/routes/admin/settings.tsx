import PasswordSettingsCard from "~/components/common/PasswordSettingsCard";
import Sidebar from "~/components/layout/Sidebar";

export default function AdminSettingsRoute() {
  return (
    <Sidebar
      title="Settings"
      subtitle="Pengaturan akun admin untuk keamanan akses panel."
    >
      <PasswordSettingsCard
        description="Gunakan password yang kuat untuk menjaga akses admin."
        successMessage="Password berhasil diperbarui untuk data dummy."
      />
    </Sidebar>
  );
}
