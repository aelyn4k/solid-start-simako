import ConfirmDialog from "~/components/ConfirmDialog";

export default function ConfirmDeleteModal(props: {
  title?: string;
  message: string;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      title={props.title ?? "Hapus Data?"}
      message={props.message}
      confirmLabel={props.confirmLabel ?? "Hapus"}
      onCancel={props.onCancel}
      onConfirm={props.onConfirm}
    />
  );
}
