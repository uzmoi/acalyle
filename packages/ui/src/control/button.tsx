import { cx, style } from "@acalyle/css";
import { vars } from "../theme";
import { base, reset } from "./base";

export const Button: React.FC<
    {
        unstyled?: boolean;
    } & React.ComponentPropsWithoutRef<"button">
> = ({ unstyled, className, ...restProps }) => {
    return (
        <button
            type="button"
            {...restProps}
            className={cx(
                reset,
                !unstyled && base,
                style({
                    fontWeight: "bold",
                    cursor: "pointer",
                    "&:disabled": {
                        color: vars.color.fg.mute,
                        cursor: "not-allowed",
                    },
                }),
                className,
            )}
        />
    );
};
