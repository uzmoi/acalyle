import { styleVariants } from "@macaron-css/core";
import { cx } from "./cx";

export type ListVariant = keyof typeof variants;

export const List: React.FC<
    (
        | (React.ComponentPropsWithoutRef<"ul"> & { ordered?: false })
        | (React.ComponentPropsWithoutRef<"ol"> & { ordered: true })
    ) & {
        variant?: ListVariant;
    }
> & {
    Item: ListItemComponent;
} = ({ ordered, variant = "unstyled", className, ...restProps }) => {
    const Component = ordered ? "ol" : "ul";
    return (
        <Component
            {...restProps}
            className={cx(variants[variant], className)}
        />
    );
};

const variants = /* #__PURE__ */ styleVariants({
    default: [],
    unstyled: {
        paddingLeft: 0,
        listStyle: "none",
    },
});

type ListItemComponent = React.FC<React.ComponentPropsWithoutRef<"li">>;
// eslint-disable-next-line pure-module/pure-module
List.Item = ({ ...restProps }) => {
    return <li {...restProps} />;
};

if (import.meta.env.DEV) {
    // eslint-disable-next-line pure-module/pure-module
    List.Item.displayName = "List.Item";
}
