import { css, cx } from "@linaria/core";
import { clamp } from "emnorst";
import { useEffect, useRef, useState } from "react";
import { useGrab } from "../global-event";

interface Vec2 {
    x: number;
    y: number;
}

const offsetPos = (
    e: MouseEvent,
    startPosition: Vec2,
    el: HTMLElement,
): Vec2 => {
    return {
        x: (startPosition.x + e.clientX) / el.clientWidth,
        y: (startPosition.y + e.clientY) / el.clientHeight,
    };
};

const changeScale = (
    e: WheelEvent,
    el: HTMLElement,
    state: Vec2 & { scale: number },
) => {
    const newScale = clamp(state.scale - e.deltaY / 1000, 0.1, 10);
    const cropContainerRect = el.getBoundingClientRect();
    const offset = {
        x: e.clientX - cropContainerRect.left,
        y: e.clientY - cropContainerRect.top,
    };
    const scaleRate = newScale / state.scale;
    const scalePoint = {
        x: 0.5 - offset.x / el.clientWidth,
        y: 0.5 - offset.y / el.clientHeight,
    };
    return {
        x: (state.x + scalePoint.x) * scaleRate - scalePoint.x,
        y: (state.y + scalePoint.y) * scaleRate - scalePoint.y,
        scale: newScale,
    };
};

export const Cropper: React.FC<{
    src?: string;
    state: Vec2 & { scale: number };
    onChange?: (state: Vec2 & { scale: number }) => void;
    className?: string;
    bgColor?: string;
}> = ({ src, state, onChange, className, bgColor = "#888888" }) => {
    const imageEl = useRef<HTMLImageElement>(null);
    const divEl = useRef<HTMLDivElement>(null);
    const [grab, setGrab] = useState<Vec2 | null>(null);
    const startGrab = useGrab<Vec2>((e, startPosition) => {
        if (divEl.current != null) {
            setGrab(offsetPos(e, startPosition, divEl.current));
        }
    }, []);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startPosition = {
            x: state.x * e.currentTarget.clientWidth - e.clientX,
            y: state.y * e.currentTarget.clientHeight - e.clientY,
        };
        startGrab(startPosition, (e, startPosition) => {
            setGrab(null);
            if (divEl.current != null) {
                onChange?.({
                    ...offsetPos(e, startPosition, divEl.current),
                    scale: state.scale,
                });
            }
        });
    };

    useEffect(() => {
        if (divEl.current) {
            const abortController = new AbortController();
            divEl.current.addEventListener(
                "wheel",
                e => {
                    e.preventDefault();
                    onChange?.(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        changeScale(e, divEl.current!, state),
                    );
                },
                { signal: abortController.signal, passive: false },
            );
            return () => abortController.abort();
        }
    }, [onChange, state]);

    const translate = grab ?? state;
    const transform = [
        `translate(${translate.x * 100}%,${translate.y * 100}%)`,
        `scale(${state.scale})`,
    ].join(" ");

    return (
        <div
            ref={divEl}
            onMouseDown={handleMouseDown}
            className={cx(CropperStyle, className)}
            // template literalはフォーマットで.toLowerCase()されない為
            style={{ backgroundColor: `${bgColor}` }}
        >
            <div className={ImageStyle} style={{ transform }}>
                <img ref={imageEl} src={src} alt="" />
            </div>
        </div>
    );
};

const CropperStyle = css`
    overflow: hidden;
`;

const ImageStyle = css`
    width: 100%;
    height: 100%;
`;
