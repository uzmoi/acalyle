import { css, cx } from "@linaria/core";

export const Modal: React.FC<{
    open?: boolean;
    className?: string;
    children?: React.ReactNode;
    onClose?: () => void;
}> = ({ open, className, children, onClose }) => {
    if (!open) return null;

    const handleClick: React.MouseEventHandler<HTMLDivElement> = e => {
        e.stopPropagation();
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            className={cx(
                css`
                    position: fixed;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    z-index: 9999;
                    background-color: #0008;
                `,
                className,
            )}
            onClick={handleClick}
        >
            {children}
        </div>
    );
};
