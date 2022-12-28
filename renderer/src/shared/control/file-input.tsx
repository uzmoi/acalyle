import { css, cx } from "@linaria/core";
import { ControlPartResetStyle } from "./base";

// prettier-ignore
type OmitPropNames = (
    // uncontrolled
    | "value"
    | "defaultValue"
    // overridden
    | "type"
    // type="text"
    | "autoComplete"
    | "autoCapitalize"
    | "autoCorrect"
    | "spellCheck"
    // string
    | "minLength"
    | "maxLength"
    | "pattern"
    | "placeholder"
    | "size"
    // numeric
    | "min"
    | "max"
    | "step"
    // type="checkbox", type="radio"
    | "checked"
    | "defaultChecked"
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

// prettier-ignore
type FileInputProps = (
    | {
        multiple?: false;
        onFileChange?: (file: File) => void;
    }
    | {
        multiple: true;
        onFileChange?: (fileList: FileList) => void;
    }
);

export const FileInput: React.FC<
    FileInputProps &
        Omit<React.ComponentPropsWithoutRef<"input">, OmitPropNames>
> = ({ onChange, onFileChange, multiple, className, ...restProps }) => {
    const handleChange =
        (onChange || onFileChange) &&
        ((e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e);
            const files = e.target.files;
            if (files != null) {
                if (multiple) {
                    onFileChange?.(files);
                } else {
                    onFileChange?.(files[0]);
                }
            }
        });

    return (
        <input
            {...restProps}
            onChange={handleChange}
            type="file"
            multiple={multiple}
            className={cx(ControlPartResetStyle, FileInputStyle, className)}
        />
    );
};

const FileInputStyle = css`
    /* - */
`;
