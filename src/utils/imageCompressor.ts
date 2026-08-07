import imageCompression from "browser-image-compression";

export interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  initialQuality?: number;
  useWebWorker?: boolean;
}

/**
 * Compresses an image file without perceptible quality loss.
 * If the file is a video or non-compressible format, returns the original file.
 */
export async function compressImage(
  file: File,
  customOptions?: CompressionOptions
): Promise<File> {
  // Only compress images
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const defaultOptions: CompressionOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 2048,
    initialQuality: 0.9,
    useWebWorker: true,
  };

  const options = { ...defaultOptions, ...customOptions };

  try {
    const compressedFile = await imageCompression(file, options);
    // Ensure the output file retains its name
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
      lastModified: Date.now(),
    });
  } catch (error) {
    console.warn("Image compression error, falling back to original file:", error);
    return file;
  }
}
