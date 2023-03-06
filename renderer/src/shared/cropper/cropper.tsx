import { css, cx } from "@linaria/core";
import { style } from "@macaron-css/core";
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

const getScalePoint = (e: MouseEvent, el: HTMLElement) => {
    const containerRect = el.getBoundingClientRect();
    return {
        x: 0.5 - (e.clientX - containerRect.left) / el.clientWidth,
        y: 0.5 - (e.clientY - containerRect.top) / el.clientHeight,
    };
};

export const changeScale = (
    state: Vec2 & { scale: number },
    scalePoint: Vec2,
    newScale: number,
) => {
    const scaleRate = newScale / state.scale;
    return clampPosition({
        x: (state.x + scalePoint.x) * scaleRate - scalePoint.x,
        y: (state.y + scalePoint.y) * scaleRate - scalePoint.y,
        scale: newScale,
    });
};

// FIXME: aspectが1じゃないときに短い方向のlower limitが弱い
const clampPosition = (
    state: Vec2 & { scale: number },
): Vec2 & { scale: number } => {
    const limit = 0.5 + state.scale / 2;
    return {
        x: clamp(state.x, -limit, limit),
        y: clamp(state.y, -limit, limit),
        scale: state.scale,
    };
};

export const Cropper: React.FC<{
    src?: string;
    state: Vec2 & { scale: number };
    onChange?: (state: Vec2 & { scale: number }) => void;
    disabled?: boolean;
    className?: string;
    bgColor?: string;
}> = ({ src, state, onChange, disabled, className, bgColor = "#888888" }) => {
    const imageEl = useRef<HTMLImageElement>(null);
    const containerEl = useRef<HTMLDivElement>(null);
    const [grab, setGrab] = useState<Vec2 | null>(null);
    const startGrab = useGrab<Vec2>(
        (e, startPosition) => {
            if (containerEl.current != null) {
                setGrab(
                    clampPosition({
                        ...offsetPos(e, startPosition, containerEl.current),
                        scale: state.scale,
                    }),
                );
            }
        },
        [state.scale],
    );
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (disabled) return;
        const startPosition = {
            x: state.x * e.currentTarget.clientWidth - e.clientX,
            y: state.y * e.currentTarget.clientHeight - e.clientY,
        };
        startGrab(startPosition, (e, startPosition) => {
            setGrab(null);
            if (containerEl.current != null) {
                onChange?.(
                    clampPosition({
                        ...offsetPos(e, startPosition, containerEl.current),
                        scale: state.scale,
                    }),
                );
            }
        });
    };

    useEffect(() => {
        if (containerEl.current) {
            const abortController = new AbortController();
            containerEl.current.addEventListener(
                "wheel",
                e => {
                    e.preventDefault();
                    if (disabled) return;
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    const scalePoint = getScalePoint(e, containerEl.current!);
                    const newScale = clamp(
                        (state.scale * 1000 - e.deltaY) / 1000,
                        0.1,
                        10,
                    );
                    onChange?.(changeScale(state, scalePoint, newScale));
                },
                { signal: abortController.signal, passive: false },
            );
            return () => abortController.abort();
        }
    }, [disabled, onChange, state]);

    const translate = grab ?? state;
    const transform = [
        `translate(${translate.x * 100}%,${translate.y * 100}%)`,
        `scale(${state.scale})`,
    ].join(" ");

    return (
        <div
            ref={containerEl}
            onMouseDown={handleMouseDown}
            className={cx(
                css`
                    overflow: hidden;
                    cursor: move;
                    user-select: none;
                    &[data-disabled="true"] {
                        cursor: not-allowed;
                        transition: filter 200ms;
                        &:hover {
                            filter: grayscale(0.75);
                        }
                    }
                `,
                className,
            )}
            // template literalはフォーマットで.toLowerCase()されない為
            style={{ backgroundColor: `${bgColor}` }}
            data-disabled={disabled}
        >
            <div
                className={style({ width: "100%", height: "100%" })}
                style={{ transform }}
            >
                <img
                    ref={imageEl}
                    className={style({ maxWidth: "100%", maxHeight: "100%" })}
                    src={src}
                    alt=""
                />
            </div>
        </div>
    );
};
