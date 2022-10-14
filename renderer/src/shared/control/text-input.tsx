import { css, cx } from "@linaria/core";
import { ControlPartBorderStyle, ControlPartResetStyle } from "./base";

export const TextInput: React.FC<{
    onValueChange?: (value: string) => void;
} & Omit<React.ComponentPropsWithoutRef<"input">, "type">> = ({
    onChange,
    onValueChange,
    className,
    ...restProps
}) => {
    const handleChange = (onChange || onValueChange) && ((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
    });

    return (
        <input
            {...restProps}
            onChange={handleChange}
            type="text"
            className={cx(TextInputStyle, className)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
        />
    );
};

const TextInputStyle = cx(ControlPartResetStyle, ControlPartBorderStyle, css`
    /* - */
`);
