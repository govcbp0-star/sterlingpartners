const MAX_SOURCE_IMAGE_BYTES = 12 * 1024 * 1024;
export const MAX_IMAGE_DATA_URL_CHARACTERS = 360 * 1024;

const acceptedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function readImage(file: File): Promise<{ image: CanvasImageSource; width: number; height: number; close?: () => void }> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file).then((bitmap) => ({
      image: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
    }));
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve({ image, width: image.naturalWidth, height: image.naturalHeight });
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This image could not be opened. Try another image file."));
    };
    image.src = objectUrl;
  });
}

export async function processLawyerImage(file: File): Promise<string> {
  if (!acceptedImageTypes.has(file.type)) {
    throw new Error("Choose a JPEG, PNG, or WebP image.");
  }

  if (file.size > MAX_SOURCE_IMAGE_BYTES) {
    throw new Error("The original image must be 12 MB or smaller.");
  }

  let decoded: Awaited<ReturnType<typeof readImage>>;

  try {
    decoded = await readImage(file);
  } catch {
    throw new Error("This image could not be opened. Try another image file.");
  }

  try {
    if (decoded.width < 1 || decoded.height < 1) {
      throw new Error("The selected image has invalid dimensions.");
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing is unavailable in this browser.");

    const dimensions = [600, 540, 480, 420, 360];
    const qualities = [0.84, 0.76, 0.68, 0.6];
    let bestCandidate = "";

    for (const maxDimension of dimensions) {
      const scale = Math.min(1, maxDimension / Math.max(decoded.width, decoded.height));
      canvas.width = Math.max(1, Math.round(decoded.width * scale));
      canvas.height = Math.max(1, Math.round(decoded.height * scale));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(decoded.image, 0, 0, canvas.width, canvas.height);

      for (const mimeType of ["image/webp", "image/jpeg"] as const) {
        for (const quality of qualities) {
          const candidate = canvas.toDataURL(mimeType, quality);
          if (!candidate.startsWith(`data:${mimeType};base64,`)) continue;
          bestCandidate = candidate;
          if (candidate.length <= MAX_IMAGE_DATA_URL_CHARACTERS) return candidate;
        }
      }
    }

    if (bestCandidate) {
      throw new Error("This image is still too large after compression. Choose a simpler or smaller image.");
    }

    throw new Error("This browser could not convert the image to WebP or JPEG.");
  } finally {
    decoded.close?.();
  }
}
