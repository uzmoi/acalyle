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
canvas.width = 512;
canvas.height = 512;
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const context = canvas.getContext("2d")!;

export const cropImage = async (
    src: string,
    crop: { x: number; y: number; scale: number },
    bgColor: string,
): Promise<Blob> => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.scale(crop.scale, crop.scale);

    const imageEl = toImageElement(src);
    await imageEl.decode();

    const aspect = imageEl.width / imageEl.height;
    let width = 512;
    let height = 512;

    // object-fit: contain;
    if (aspect > 1) {
        height = width / aspect;
    } else if (aspect < 1) {
        width = height * aspect;
    }

    // このaは何なのかわからん
    const a = 0.5 - 1 / (2 * crop.scale);
    const dx = (crop.x / crop.scale - a) * 512;
    const dy = (crop.y / crop.scale - a) * 512;
    context.drawImage(imageEl, dx, dy, width, height);

    context.resetTransform();

    return canvasToBlob(canvas);
};
