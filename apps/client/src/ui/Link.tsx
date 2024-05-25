import { cx, style } from "@acalyle/css";
import { Location } from "~/store/location";

export const Link: React.FC<
    {
        to: string;
    } & Omit<React.ComponentPropsWithoutRef<"a">, "href">
> = ({ to, className, onClick, ...rest }) => {
    return (
        <a
            {...rest}
            className={cx(
                style({
                    color: "inherit",
                    textDecoration: "none",
                }),
                className,
            )}
            href={to}
            onClick={e => {
                onClick?.(e);
                if (e.defaultPrevented) return;
                e.preventDefault();
                Location.set(to);
            }}
        />
    );
};
