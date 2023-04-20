import { globalStyle, style } from "@macaron-css/core";
import { cx } from "../base/cx";
import { ControlPartOutlineStyle, borderRadius } from "./base";

export const ControlGroup: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ className, children }) => {
    return <div className={cx(ControlGroupStyle, className)}>{children}</div>;
};

export const ControlGroupStyle = style({
    display: "inline-block",
});

globalStyle(`.${ControlGroupStyle} > .${ControlPartOutlineStyle}`, {
    borderRadius: 0,
});

globalStyle(`.${ControlGroupStyle} > :first-child`, {
    borderRadius: `${borderRadius} 0 0 ${borderRadius}`,
});

globalStyle(`.${ControlGroupStyle} > :last-child`, {
    borderRadius: `0 ${borderRadius} ${borderRadius} 0`,
});

globalStyle(`.${ControlGroupStyle} > :only-child`, {
    borderRadius,
});

globalStyle(
    `.${ControlGroupStyle} > .${ControlPartOutlineStyle} + .${ControlPartOutlineStyle}`,
    {
        marginLeft: "-1px",
    },
);
