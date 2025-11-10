import { List } from "@acalyle/ui";
import { Tag } from "~/entities/tag";

export const TagList: React.FC<{
  tags: readonly Tag[];
  className?: string;
}> = ({ tags, className }) => {
  return (
    <List className={className}>
      {tags.map(tag => (
        <List.Item key={tag} className=":uno: inline-block px-0.5">
          <Tag tag={tag} />
        </List.Item>
      ))}
    </List>
  );
};
