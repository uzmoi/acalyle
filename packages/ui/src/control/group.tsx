/* eslint-disable pure-module/pure-module */
import { cx, globalStyle, style } from "@acalyle/css";
import { vars } from "../theme";
import { control } from "./base";

export const ControlGroup: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ className, children }) => {
    return <div className={cx(ControlGroupStyle, className)}>{children}</div>;
};

export const ControlGroupStyle = style({
    display: "inline-block",
});

globalStyle(`.${ControlGroupStyle} > .${control.solid} + .${control.solid}`, {
    marginLeft: "1px",
});

globalStyle(`.${ControlGroupStyle} > .${control.outline}`, {
    borderRadius: 0,
});

globalStyle(`.${ControlGroupStyle} > .${control.outline}:first-child`, {
    borderRadius: `${vars.radius.control} 0 0 ${vars.radius.control}`,
});

globalStyle(`.${ControlGroupStyle} > .${control.outline}:last-child`, {
    borderRadius: `0 ${vars.radius.control} ${vars.radius.control} 0`,
});

globalStyle(`.${ControlGroupStyle} > .${control.outline}:only-child`, {
    borderRadius: vars.radius.control,
});

globalStyle(
    `.${ControlGroupStyle} > .${control.outline} + .${control.outline}`,
    {
        marginLeft: "-1px",
    },
);
