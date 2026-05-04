export const maxImageSize = 2 * 1024 * 1024;
export const allowedImageMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const allowedImageExtensions = ["jpg", "jpeg", "png", "webp"];

export const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isValidUrl = (value: string) => {
  if (!value.trim()) {
    return true;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export const isNumeric = (value: string) => value.trim() !== "" && !Number.isNaN(Number(value));

export const validateImageFile = (file: File, maxSize = maxImageSize) => {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";

  if (!allowedImageMimeTypes.includes(file.type) || !allowedImageExtensions.includes(extension)) {
    return "Format foto hanya JPG, JPEG, PNG, atau WEBP.";
  }

  if (file.size > maxSize) {
    return "Ukuran foto maksimal 2MB.";
  }

  return "";
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
