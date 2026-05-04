import { ImageOff, X } from "lucide-solid";
import { createSignal } from "solid-js";
import { fileToDataUrl, maxImageSize, validateImageFile } from "~/utils/validation";

export default function ImageUpload(props: {
  value: string[];
  maxFiles?: number;
  maxSize?: number;
  onChange: (images: string[]) => void;
}) {
  const [error, setError] = createSignal("");
  const maxFiles = () => props.maxFiles ?? 1;
  const maxSize = () => props.maxSize ?? maxImageSize;

  const handleFiles = async (fileList: FileList | null) => {
    const selectedFiles = Array.from(fileList ?? []);

    if (selectedFiles.length === 0) {
      return;
    }

    if (props.value.length + selectedFiles.length > maxFiles()) {
      setError(`Maksimal ${maxFiles()} foto.`);
      return;
    }

    const invalidMessage = selectedFiles.map((file) => validateImageFile(file, maxSize())).find(Boolean);

    if (invalidMessage) {
      setError(invalidMessage);
      return;
    }

    try {
      const images = await Promise.all(selectedFiles.map(fileToDataUrl));
      props.onChange([...props.value, ...images].slice(0, maxFiles()));
      setError("");
    } catch {
      setError("Gagal membaca file gambar.");
    }
  };

  const removeImage = (index: number) => {
    props.onChange(props.value.filter((_, imageIndex) => imageIndex !== index));
    setError("");
  };

  return (
    <div class="grid gap-3">
      <input
        class="form-control"
        type="file"
        multiple={maxFiles() > 1}
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(event) => void handleFiles(event.currentTarget.files)}
      />

      {error() && <p class="text-xs font-semibold text-red-400">{error()}</p>}
      <p class="dashboard-muted text-xs">Opsional. Format JPG/JPEG/PNG/WEBP, ukuran tiap foto maksimal 2MB.</p>

      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {props.value.length > 0 ? (
          props.value.map((image, index) => (
            <div class="relative overflow-hidden rounded-xl border border-[var(--surface-border)] bg-[var(--control-bg)]">
              <img src={image} alt={`Preview foto ${index + 1}`} class="h-28 w-full object-cover" />
              <button
                type="button"
                class="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/70 text-white"
                aria-label="Hapus foto"
                onClick={() => removeImage(index)}
              >
                <X size={14} />
              </button>
            </div>
          ))
        ) : (
          <div class="flex h-28 flex-col items-center justify-center rounded-xl border border-dashed border-[var(--surface-border)] bg-[var(--control-bg)] text-sm text-[rgb(var(--text-muted-rgb))] sm:col-span-2 lg:col-span-4">
            <ImageOff size={18} />
            <span class="mt-1">Tidak ada foto</span>
          </div>
        )}
      </div>
    </div>
  );
}
