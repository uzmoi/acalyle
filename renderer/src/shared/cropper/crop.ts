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
    translate: { x: number; y: number },
    bgColor: string,
): Promise<Blob> => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.translate(translate.x, translate.y);

    const imageEl = toImageElement(src);
    await imageEl.decode();

    let width = 512;
    let height = 512;
    if (imageEl.width > imageEl.height) {
        height = imageEl.height * (width / imageEl.width);
    }
    if (imageEl.width < imageEl.height) {
        width = imageEl.width * (height / imageEl.height);
    }
    context.drawImage(imageEl, 0, 0, width, height);

    context.resetTransform();

    return canvasToBlob(canvas);
};
