import { css, cx } from "@linaria/core";

export type ListVariant = keyof typeof variantStyles;

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
            className={cx(variantStyles[variant], className)}
        />
    );
};

const ListResetStyle = css`
    padding-left: 0;
    list-style: none;
`;

const variantStyles = {
    default: "",
    unstyled: ListResetStyle,
} satisfies Record<string, string>;

type ListItemComponent = React.FC<React.ComponentPropsWithoutRef<"li">>;
List.Item = ({ className, ...restProps }) => {
    return <li {...restProps} className={cx(ListItemStyle, className)} />;
};

if (import.meta.env.DEV) {
    List.Item.displayName = "List.Item";
}

const ListItemStyle = css`
    /* - */
`;
