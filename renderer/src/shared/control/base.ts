import { css } from "@linaria/core";
import { vars } from "~/entities/theme";

export const ControlPartResetStyle = css`
    padding: 0;
    font: inherit;
    color: inherit;
    background-color: transparent;
    border: none;
    outline: none;
    appearance: none;
`;

export const borderRadius = "4px";
export const ControlPartBorderStyle = css`
    padding: 0.2em 0.8em;
    border: 1px solid ${vars.color.text};
    border-radius: ${borderRadius};
    &:focus {
        border-color: var(--color-accent);
    }
    &[aria-invalid="true"] {
        border-color: var(--color-error);
    }
`;
