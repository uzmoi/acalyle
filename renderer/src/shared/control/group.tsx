import { css, cx } from "@linaria/core";
import { ControlPartOutlineStyle, borderRadius } from "./base";

export const ControlGroup: React.FC<{
    children?: React.ReactNode;
    className?: string;
}> = ({ className, children }) => {
    return <div className={cx(ControlGroupStyle, className)}>{children}</div>;
};

export const ControlGroupStyle = css`
    display: inline-block;
    > .${ControlPartOutlineStyle} {
        border-radius: 0;
    }
    > :first-child {
        border-radius: ${borderRadius} 0 0 ${borderRadius};
    }
    > :last-child {
        border-radius: 0 ${borderRadius} ${borderRadius} 0;
    }
    > :only-child {
        border-radius: ${borderRadius};
    }
    & > .${ControlPartOutlineStyle} + .${ControlPartOutlineStyle} {
        margin-left: -1px;
    }
`;
