import { css, cx } from "@linaria/core";
import { useRef, useState } from "react";
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

export const Cropper: React.FC<{
    src?: string;
    state: Vec2;
    onChange?: (state: Vec2) => void;
    className?: string;
    bgColor?: string;
}> = ({ src, state, onChange, className, bgColor = "#888888" }) => {
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
                onChange?.(offsetPos(e, startPosition, divEl.current));
            }
        });
    };

    const translate = grab ?? state;
    const transform = `translate(${translate.x * 100}%,${translate.y * 100}%)`;

    return (
        <div
            ref={divEl}
            onMouseDown={handleMouseDown}
            className={cx(CropperStyle, className)}
            // template literalはフォーマットで.toLowerCase()されない為
            style={{ backgroundColor: `${bgColor}` }}
        >
            <div className={ImageStyle} style={{ transform }}>
                <img src={src} alt="" />
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
