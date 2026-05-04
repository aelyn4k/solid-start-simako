import PasswordSettingsCard from "~/components/common/PasswordSettingsCard";

export default function OwnerSettings() {
  return (
    <PasswordSettingsCard
      description="Gunakan password yang kuat untuk menjaga akses panel pemilik kost."
      successMessage="Password berhasil diperbarui untuk data dummy."
    />
  );
}
