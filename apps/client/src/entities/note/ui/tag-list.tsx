import { cx } from "@acalyle/css";
import { List } from "@acalyle/ui";
import { Tag } from "~/entities/tag";

export const TagList: React.FC<{
  tags: readonly Tag[];
  className?: string;
}> = ({ tags, className }) => {
  return (
    <List className={cx(":uno: flex flex-wrap gap-1", className)}>
      {tags.map(tag => (
        <List.Item key={tag}>
          <Tag tag={tag} />
        </List.Item>
      ))}
    </List>
  );
};
