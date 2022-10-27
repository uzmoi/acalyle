import { cx } from "@linaria/core";
import { ControlPartBorderStyle, ControlPartResetStyle } from "./base";

type OmitPropNames = (
    // overrided
    | "type"
    | "autoComplete"
    | "autoCapitalize"
    | "autoCorrect"
    | "spellCheck"
    // numeric
    | "min"
    | "max"
    | "step"
    // type="checkbox", type="radio"
    | "checked"
    | "defaultChecked"
    // type="file"
    | "accept"
    | "capture"
    | "multiple"
    // type="image"
    | "src"
    | "alt"
    | "width"
    | "height"
    // type="image", type="submit"
    | "formAction"
    | "formEncType"
    | "formMethod"
    | "formNoValidate"
    | "formTarget"
);

export const TextInput: React.FC<{
    value?: string;
    onValueChange?: (value: string) => void;
} & Omit<React.ComponentPropsWithoutRef<"input">, OmitPropNames>> = ({
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

const TextInputStyle = cx(ControlPartResetStyle, ControlPartBorderStyle);
