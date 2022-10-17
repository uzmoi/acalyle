import { css, cx } from "@linaria/core";
import { ControlPartResetStyle } from "./base";

export const FileInput: React.FC<({
    multiple?: false;
    onFileChange?: (file: File) => void;
} | {
    multiple: true;
    onFileChange?: (fileList: FileList) => void;
}) & Omit<React.ComponentPropsWithoutRef<"input">, "type">> = ({
    onChange,
    onFileChange,
    multiple,
    className,
    ...restProps
}) => {
    const handleChange = (onChange || onFileChange) && ((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        const files = e.target.files;
        if(files != null) {
            if(multiple) {
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
            className={cx(FileInputStyle, className)}
        />
    );
};

const FileInputStyle = cx(ControlPartResetStyle, css`
    /* - */
`);
