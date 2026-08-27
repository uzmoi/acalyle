import { cx, style } from "asarina";
import type { BookId } from "#/entities/book";
import { type Note, TagList } from "#/entities/note";
import { themeVar } from "#/entities/theme";
import { NoteActionButton } from "#/features/note-action";
import { DateTimeView } from "#/shared/ui";
import { NoteContents } from "~/entities/note/ui/contents";

export const DetailedNoteView: React.FC<{
  bookId: BookId;
  note: Note;
}> = ({ note }) => {
  const lastUpdatedAt =
    note.createdAt === note.updatedAt ?
      { name: "に作成", dt: note.createdAt }
    : { name: "に更新", dt: note.updatedAt };

  return (
    <article data-note-id={note.id}>
      <TagList tags={note.tags} />

      <div className=":uno: flex items-center gap-2 my-2">
        <p
          className={cx(
            ":uno: flex-1 text-xs",
            style({ color: themeVar("ui-muted-text") }),
          )}
        >
          <DateTimeView dt={lastUpdatedAt.dt} />
          {lastUpdatedAt.name}
        </p>
        <NoteActionButton noteIds={new Set([note.id])} />
      </div>

      <NoteContents contents={note.contents} />
    </article>
  );
};
