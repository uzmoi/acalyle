import { NoteTag } from "@acalyle/core";
import { List } from "@acalyle/ui";
import { nonNullable } from "emnorst";
import type { NoteTagString } from "../model";
import { Tag } from "./tag";

export const TagList: React.FC<{
  tags: readonly NoteTagString[];
  className?: string;
}> = ({ tags, className }) => {
  const noteTags = tags.map(NoteTag.fromString).filter(nonNullable);

  return (
    <List className={className}>
      {noteTags.map(tag => (
        <List.Item key={tag.symbol} className=":uno: inline-block px-0.5">
          <Tag tag={tag} />
        </List.Item>
      ))}
    </List>
  );
};
