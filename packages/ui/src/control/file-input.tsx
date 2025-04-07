import { cx } from "@acalyle/css";
import { reset } from "./base";

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

export type FileInputProps = (
  | {
      multiple?: false;
      onFileChange?: (file: File) => void;
    }
  | {
      multiple: true;
      onFileChange?: (fileList: FileList) => void;
    }
) &
  Omit<React.ComponentProps<"input">, OmitPropNames>;

export const FileInput: React.FC<FileInputProps> = ({
  onChange,
  onFileChange,
  multiple,
  className,
  ...restProps
}) => {
  const handleChange =
    (onChange ?? onFileChange) &&
    ((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      const files = e.target.files;
      if (files != null) {
        if (multiple) {
          onFileChange?.(files);
        } else if (files[0] != null) {
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
      className={cx(reset, className)}
    />
  );
};
