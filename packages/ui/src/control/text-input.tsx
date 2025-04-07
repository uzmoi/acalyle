import { cx } from "@acalyle/css";
import { base, reset } from "./base";

// prettier-ignore
type OmitPropNames = (
  // overridden
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

export interface TextInputProps
  extends Omit<React.ComponentProps<"input">, OmitPropNames> {
  type?: "text" | "search" | "password" | "url" | "email" | "tel";
  unstyled?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({
  unstyled,
  onChange,
  onValueChange,
  className,
  ...restProps
}) => {
  const handleChange =
    (onChange ?? onValueChange) &&
    ((e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onValueChange?.(e.target.value);
    });

  return (
    <input
      onChange={handleChange}
      type="text"
      className={cx(reset, !unstyled && base, className)}
      {...restProps}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
};
