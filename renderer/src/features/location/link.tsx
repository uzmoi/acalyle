import { css, cx } from "@linaria/core";
import { useNavigate } from "./location";

export const Link: React.FC<
    {
        to: string;
    } & Omit<React.ComponentPropsWithoutRef<"a">, "href">
> = ({ to, className, ...rest }) => {
    const navigate = useNavigate();

    return (
        <a
            {...rest}
            className={cx(LinkStyle, className)}
            href={to}
            onClick={e => {
                if (e.defaultPrevented) return;
                e.preventDefault();
                navigate(to);
            }}
        />
    );
};

const LinkStyle = css`
    color: inherit;
    text-decoration: none;
`;
