import { css, cx } from "@linaria/core";
import { ControlPartBorderStyle, ControlPartResetStyle } from "./base";

const ZeroWidthSpace = "\u200b";

export const TextArea: React.FC<
    {
        value?: string;
        onValueChange?: (value: string) => void;
        textareaId?: string;
        placeholder?: string;
        autoFocus?: boolean;
        disabled?: boolean;
        readOnly?: boolean;
    } & React.ComponentPropsWithoutRef<"div">
> = ({
    value,
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
            className={cx(ControlPartBorderStyle, ContainerStyle, className)}
        >
            <textarea
                id={textareaId}
                // form={form}
                // name={name}
                value={value}
                onChange={handleChange}
                className={cx(ControlPartResetStyle, TextAreaStyle)}
                autoFocus={autoFocus}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
            />
            <div className={PreStyle} aria-hidden>
                {value}
                {ZeroWidthSpace}
            </div>
        </div>
    );
};

const ContainerStyle = css`
    position: relative;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    --caret-color: white /* currentcolor */;
`;

const TextAreaStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: inherit;
    overflow: hidden;
    color: transparent;
    text-align: inherit;
    text-indent: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    overflow-wrap: inherit;
    white-space: inherit;
    resize: none;
    word-spacing: inherit;
    caret-color: var(--caret-color);
    /* opacity: 0; */
`;

const PreStyle = css`
    min-height: 1em;
    pointer-events: none;
    user-select: none;
`;
