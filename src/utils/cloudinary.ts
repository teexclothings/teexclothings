/**
 * Helper to check if valid Cloudinary credentials are configured.
 */
export function isCloudinaryConfigured(): boolean {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  return Boolean(
    cloudName &&
      uploadPreset &&
      cloudName !== "your_cloud_name" &&
      uploadPreset !== "your_upload_preset"
  );
}

/**
 * Uploads a file (compressed image or video) to Cloudinary.
 * @param file File object to upload
 * @param folder Optional Cloudinary folder prefix
 * @returns The Cloudinary secure URL string
 */
export async function uploadToCloudinary(file: File, folder: string = "teex_clothings"): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured yet. Please update NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env.local file."
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset!);
  formData.append("folder", folder);

  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    throw new Error(`Cloudinary upload failed: ${errorMessage}`);
  }

  const data = await response.json();
  return data.secure_url;
}
