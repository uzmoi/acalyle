import { style, styleVariants } from "@macaron-css/core";
import { cx } from "../base/cx";
import { vars } from "../theme";
import { ControlPartOutlineStyle, ControlPartResetStyle } from "./base";

const ZeroWidthSpace = "\u200b";

export type TextAreaVariant = keyof typeof variants;

export const TextArea: React.FC<
    {
        variant?: TextAreaVariant;
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
    variant = "outline",
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
                variants[variant],
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
                    ControlPartResetStyle,
                    style({
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        padding: "inherit",
                        overflow: "hidden",
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
                        // opacity: 0,
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

const variants = styleVariants({
    outline: [ControlPartOutlineStyle],
    unstyled: [],
});
