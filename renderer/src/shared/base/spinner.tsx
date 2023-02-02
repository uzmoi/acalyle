import { css } from "@linaria/core";

export const Spinner: React.FC<{
    size?: number;
}> = ({ size = 1 }) => {
    return (
        <div
            style={{ "--size": `${size}` }}
            className={css`
                display: inline-block;
                width: calc(var(--size) * 1em);
                height: calc(var(--size) * 1em);
                border: solid calc(var(--size) * 0.125em);
                border-color: transparent currentcolor;
                border-radius: 50%;
                animation: spin 1s ease-in-out infinite;
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            `}
        />
    );
};
