import { cx, style } from "@acalyle/css";

export type ListVariant = "default" | "unstyled";

interface UnorderedListProps extends React.ComponentProps<"ul"> {
  ordered?: false;
}

interface OrderedListProps extends React.ComponentProps<"ol"> {
  ordered: true;
}

export type ListProps = (UnorderedListProps | OrderedListProps) & {
  variant?: ListVariant;
};

export const List: React.FC<ListProps> & {
  Item: ListItemComponent;
} = ({ ordered, variant = "unstyled", className, ...restProps }) => {
  // ref の型が合わなくなるので ul に偽装
  const Component = ordered ? ("ol" as string as "ul") : "ul";
  return (
    <Component
      {...restProps}
      className={cx(
        variant === "unstyled" && style({ paddingLeft: 0, listStyle: "none" }),
        className,
      )}
    />
  );
};

type ListItemComponent = React.FC<React.ComponentProps<"li">>;
// eslint-disable-next-line pure-module/pure-module
List.Item = props => {
  return <li {...props} />;
};

if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  List.Item.displayName = "List.Item";
}
