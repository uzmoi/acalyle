import { css, cx } from "@linaria/core";
import { ControlPartBorderStyle, ControlPartResetStyle } from "./base";

export const Button: React.FC<{
    //
} & React.ComponentPropsWithoutRef<"button">> = ({ className, ...restProps }) => {
    return (
        <button
            type="button"
            {...restProps}
            className={cx(ButtonStyle, className)}
        />
    );
};

const ButtonStyle = cx(ControlPartResetStyle, ControlPartBorderStyle, css`
    font-weight: bold;
    cursor: pointer;
`);
