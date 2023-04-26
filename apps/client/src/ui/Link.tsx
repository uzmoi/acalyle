import { cx } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { Location } from "~/store/location";

export const Link: React.FC<
    {
        to: string;
    } & Omit<React.ComponentPropsWithoutRef<"a">, "href">
> = ({ to, className, ...rest }) => {
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
                if (e.defaultPrevented) return;
                e.preventDefault();
                Location.set(to);
            }}
        />
    );
};
