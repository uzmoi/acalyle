import { css, cx } from "@linaria/core";

export const Form: React.FC<React.ComponentPropsWithoutRef<"form">> = ({
    onSubmit,
    className,
    ...restProps
}) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form
            {...restProps}
            onSubmit={handleSubmit}
            className={cx(FormStyle, className)}
        />
    );
};

const FormStyle = css`
    /* - */
`;
