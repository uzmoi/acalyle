import { css, cx } from "@linaria/core";
import { useState } from "react";
import { useGrab } from "../global-event";

interface Vec2 {
    x: number;
    y: number;
}

const offsetPos = (e: MouseEvent, startTranslate: Vec2): Vec2 => {
    return {
        x: startTranslate.x + e.clientX,
        y: startTranslate.y + e.clientY,
    };
};

export const Cropper: React.FC<{
    src?: string;
    state: Vec2;
    onChange?: (state: Vec2) => void;
    className?: string;
}> = ({ src, state, onChange, className }) => {
    const [grabState, setGrabState] = useState<Vec2 | null>(null);
    const startGrab = useGrab<Vec2>((e, startTranslate) => {
        setGrabState(offsetPos(e, startTranslate));
    }, []);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        const startTranslate = {
            x: state.x - e.clientX,
            y: state.y - e.clientY,
        };
        startGrab(startTranslate, (e, startTranslate) => {
            setGrabState(null);
            onChange?.(offsetPos(e, startTranslate));
        });
    };

    const transformState = grabState ?? state;
    const transform = `translate(${transformState.x}px,${transformState.y}px)`;

    return (
        <div
            onMouseDown={handleMouseDown}
            className={cx(CropperStyle, className)}
        >
            <img src={src} alt="" style={{ transform }} />
        </div>
    );
};

const CropperStyle = css`
    overflow: hidden;
    background-color: #888;
`;
