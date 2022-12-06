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
): Promise<Blob> => {
    context.resetTransform();
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.translate(translate.x, translate.y);

    const imageEl = toImageElement(src);
    await imageEl.decode();
    context.drawImage(imageEl, 0, 0);

    return canvasToBlob(canvas);
};
