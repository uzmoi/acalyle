import { cx, style } from "@acalyle/css";
import { useRef } from "react";
import { vars } from "../theme";
import { type ControlPartVariant, control } from "./base";

const ZeroWidthSpace = "\u200B";

export const TextArea: React.FC<
    {
        variant?: ControlPartVariant;
        onValueChange?: (value: string) => void;
    } & React.ComponentPropsWithoutRef<"textarea">
> = ({
    variant = "solid",
    value,
    defaultValue,
    onChange,
    onValueChange,
    className,
    ...restProps
}) => {
    const dummyEl = useRef<HTMLDivElement>(null);
    const handleChange =
        (value == null || (onChange ?? onValueChange)) &&
        ((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            if (value == null && dummyEl.current) {
                dummyEl.current.textContent = e.target.value + ZeroWidthSpace;
            }
            onChange?.(e);
            onValueChange?.(e.target.value);
        });

    return (
        <div
            className={cx(
                control.base,
                control[variant],
                style({
                    position: "relative",
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    "--caret-color": vars.color.fg.__,
                }),
                className,
            )}
        >
            <textarea
                {...restProps}
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
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
            />
            <div
                ref={dummyEl}
                className={style({
                    minHeight: "1em",
                    pointerEvents: "none",
                    userSelect: "none",
                })}
                aria-hidden
            >
                {value ?? defaultValue}
                {ZeroWidthSpace}
            </div>
        </div>
    );
};
