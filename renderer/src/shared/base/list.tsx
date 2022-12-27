import { css, cx } from "@linaria/core";

export const List: React.FC<
    | (React.ComponentPropsWithoutRef<"ul"> & { ordered?: false })
    | (React.ComponentPropsWithoutRef<"ol"> & { ordered: true })
> & {
    Item: ListItemComponent;
} = ({ ordered, className, ...restProps }) => {
    const Component = ordered ? "ol" : "ul";
    return (
        <Component {...restProps} className={cx(ListResetStyle, className)} />
    );
};

const ListResetStyle = css`
    padding-left: 0;
    list-style: none;
`;

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
