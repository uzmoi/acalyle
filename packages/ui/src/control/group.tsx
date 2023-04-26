import { globalStyle, style } from "@macaron-css/core";
import { cx } from "../base/cx";
import { vars } from "../theme";
import { ControlPartOutlineStyle } from "./base";

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
    borderRadius: `${vars.radius.control} 0 0 ${vars.radius.control}`,
});

globalStyle(`.${ControlGroupStyle} > :last-child`, {
    borderRadius: `0 ${vars.radius.control} ${vars.radius.control} 0`,
});

globalStyle(`.${ControlGroupStyle} > :only-child`, {
    borderRadius: vars.radius.control,
});

globalStyle(
    `.${ControlGroupStyle} > .${ControlPartOutlineStyle} + .${ControlPartOutlineStyle}`,
    {
        marginLeft: "-1px",
    },
);
