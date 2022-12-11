export const toImageElement = (src: string) => {
    const imageEl = new Image();
    imageEl.src = src;
    return imageEl;
};

export const canvasToBlob = (
    canvas: HTMLCanvasElement,
    type?: string,
    quality?: unknown,
) => {
    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            blob => {
                if (blob == null) {
                    reject();
                } else {
                    resolve(blob);
                }
            },
            type,
            quality,
        );
    });
};

const canvas = document.createElement("canvas");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const context = canvas.getContext("2d")!;

export const cropImage = async (
    src: string,
    cropSize: { width: number; height: number },
    crop: { x: number; y: number; scale: number },
    bgColor: string,
): Promise<Blob> => {
    const imageEl = toImageElement(src);
    await imageEl.decode();

    canvas.width = cropSize.width;
    canvas.height = cropSize.height;
    context.fillStyle = bgColor;
    context.fillRect(0, 0, cropSize.width, cropSize.height);

    context.scale(crop.scale, crop.scale);

    const aspect = imageEl.width / imageEl.height;
    let { width, height } = cropSize;

    // object-fit: contain;
    if (aspect > 1) {
        height = width / aspect;
    } else if (aspect < 1) {
        width = height * aspect;
    }

    // このaは何なのかわからん
    const a = 0.5 - 1 / (2 * crop.scale);
    const dx = (crop.x / crop.scale - a) * cropSize.width;
    const dy = (crop.y / crop.scale - a) * cropSize.height;
    context.drawImage(imageEl, dx, dy, width, height);

    context.resetTransform();

    return canvasToBlob(canvas);
};
