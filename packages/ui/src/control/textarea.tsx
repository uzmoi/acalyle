import { style } from "@macaron-css/core";
import { cx } from "../base/cx";
import { vars } from "../theme";
import { type ControlPartVariant, control } from "./base";

const ZeroWidthSpace = "\u200B";

export const TextArea: React.FC<
    {
        variant?: ControlPartVariant;
        value?: string;
        defaultValue?: string;
        onValueChange?: (value: string) => void;
        textareaId?: string;
        placeholder?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        readOnly?: boolean;
    } & React.ComponentPropsWithoutRef<"div">
> = ({
    variant = "solid",
    value,
    defaultValue,
    onValueChange,
    textareaId,
    placeholder,
    autoFocus,
    disabled,
    readOnly,
    className,
    ...restProps
}) => {
    const handleChange =
        onValueChange &&
        ((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onValueChange(e.target.value);
        });

    return (
        <div
            {...restProps}
            className={cx(
                control.base,
                control[variant],
                style({
                    position: "relative",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    vars: {
                        "--caret-color": vars.color.fg.__,
                    },
                }),
                className,
            )}
        >
            <textarea
                id={textareaId}
                // form={form}
                // name={name}
                value={value}
                defaultValue={defaultValue}
                onChange={handleChange}
                className={cx(
                    style({
                        position: "absolute",
                        inset: 0,
                        padding: "inherit",
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        appearance: "none",
                        font: "inherit",
                        color: "transparent",
                        textAlign: "inherit",
                        textIndent: "inherit",
                        textTransform: "inherit",
                        letterSpacing: "inherit",
                        overflowWrap: "inherit",
                        whiteSpace: "inherit",
                        resize: "none",
                        wordSpacing: "inherit",
                        caretColor: "var(--caret-color)",
                    }),
                )}
                autoFocus={autoFocus}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
            />
            <div
                className={style({
                    minHeight: "1em",
                    pointerEvents: "none",
                    userSelect: "none",
                })}
                aria-hidden
            >
                {value}
                {ZeroWidthSpace}
            </div>
        </div>
    );
};
