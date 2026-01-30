type PixelCrop = {
    x: number;
    y: number;
    width: number;
    height: number;
};
function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (e) => reject(e));
        img.crossOrigin = "anonymous";
        img.src = url;
    });
}
export async function getCroppedFile(params: {
    imageSrc: string;
    crop: PixelCrop;
    fileName: string;
    mimeType: "image/png" | "image/jpeg" | "image/webp";
    quality?: number;
}): Promise<File> {
    const { imageSrc, crop, fileName, mimeType, quality = 0.92 } = params;
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx)
        throw new Error("Canvas is not supported");
    canvas.width = Math.max(1, Math.floor(crop.width));
    canvas.height = Math.max(1, Math.floor(crop.height));
    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
    const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to create image blob"))), mimeType, mimeType === "image/jpeg" || mimeType === "image/webp" ? quality : undefined);
    });
    return new File([blob], fileName, { type: mimeType });
}
