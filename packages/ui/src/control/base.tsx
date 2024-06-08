import { cx, style } from "@acalyle/css";
import { vars } from "../theme";

export const ControlGroup: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ className, children }) => {
    return <div className={cx(group, className)}>{children}</div>;
};

const group = style({ display: "inline-block" });

export const reset = style({
    padding: 0,
    font: "inherit",
    color: "inherit",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: 0,
    outline: "none",
    appearance: "none",
});

export const base = style({
    padding: "0.2em 0.8em",
    border: `2px solid ${vars.color.fg.__}`,
    transition: "border-color 400ms",
    // cspell:word lightgreen
    "&:focus-visible": {
        borderColor: "lightgreen",
    },
    "&:focus-visible + &": {
        borderLeftColor: "lightgreen",
    },
    '&:invalid, &[aria-invalid="true"]': {
        borderColor: vars.color.danger,
    },
    '&:invalid + &, &[aria-invalid="true"] + &': {
        borderLeftColor: vars.color.danger,
    },

    borderRadius: vars.radius.control,
    selectors: {
        [`.${group} > & + &`]: { marginLeft: "-1px" },
        [`.${group} > &`]: { borderRadius: 0 },
        [`.${group} > &:first-child`]: {
            borderRadius: `${vars.radius.control} 0 0 ${vars.radius.control}`,
        },
        [`.${group} > &:last-child`]: {
            borderRadius: `0 ${vars.radius.control} ${vars.radius.control} 0`,
        },
        [`.${group} > &:only-child`]: {
            borderRadius: vars.radius.control,
        },
    },
});
