import { css } from "@linaria/core";
import { vars } from "../theme";

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
export const ControlPartOutlineStyle = css`
    padding: 0.2em 0.8em;
    border: 1px solid ${vars.color.text};
    border-radius: ${borderRadius};
    transition: border-color 400ms;
    &:focus {
        border-color: lightgreen;
    }
    &:invalid,
    &[aria-invalid="true"] {
        border-color: red;
    }
`;
