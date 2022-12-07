import { css, cx } from "@linaria/core";
import { useRef, useState } from "react";
import { useGrab } from "../global-event";

interface Vec2 {
    x: number;
    y: number;
}

const offsetPos = (
    e: MouseEvent,
    startTranslate: Vec2,
    el: HTMLElement,
): Vec2 => {
    return {
        x: (startTranslate.x + e.clientX) / el.clientWidth,
        y: (startTranslate.y + e.clientY) / el.clientHeight,
    };
};

export const Cropper: React.FC<{
    src?: string;
    state: Vec2;
    onChange?: (state: Vec2) => void;
    className?: string;
}> = ({ src, state, onChange, className }) => {
    const divEl = useRef<HTMLDivElement>(null);
    const [grabState, setGrabState] = useState<Vec2 | null>(null);
    const startGrab = useGrab<Vec2>((e, startTranslate) => {
        if (divEl.current != null) {
            setGrabState(offsetPos(e, startTranslate, divEl.current));
        }
    }, []);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startTranslate = {
            x: state.x * e.currentTarget.clientWidth - e.clientX,
            y: state.y * e.currentTarget.clientHeight - e.clientY,
        };
        startGrab(startTranslate, (e, startTranslate) => {
            setGrabState(null);
            if (divEl.current != null) {
                onChange?.(offsetPos(e, startTranslate, divEl.current));
            }
        });
    };

    const translate = grabState ?? state;
    const transform = `translate(${translate.x * 100}%,${translate.y * 100}%)`;

    return (
        <div
            ref={divEl}
            onMouseDown={handleMouseDown}
            className={cx(CropperStyle, className)}
        >
            <div className={ImageStyle} style={{ transform }}>
                <img src={src} alt="" />
            </div>
        </div>
    );
};

const CropperStyle = css`
    overflow: hidden;
    background-color: #888;
`;

const ImageStyle = css`
    width: 100%;
    height: 100%;
`;
