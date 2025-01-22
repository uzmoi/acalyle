import { style } from "@acalyle/css";
import { Button } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { BiExpandAlt, BiX } from "react-icons/bi";
import type { ID } from "~/lib/graphql";
import { Note } from "~/note/ui/note";
import { type NoteModalInput, close } from "../model";

export const NoteModalContent: React.FC<NoteModalInput> = ({
  bookId,
  noteId,
}) => {
  return (
    <section className=":uno: h-full flex flex-col flex-nowrap gap-4">
      <header className=":uno: flex flex-[0_0] flex-basis-8 rounded-4 px-3 py-2 align-middle">
        <p className=":uno: flex-auto overflow-hidden text-ellipsis ws-pre">
          Note / <span className=":uno: select-all">{noteId}</span>
        </p>
        <div
          className={style({
            flex: "0 0 auto",
            "& + &": { paddingLeft: "0.5em" },
          })}
        >
          <Link
            // TODO: ノートのページを追加したらパスを変更
            to="/books/$book-ref"
            params={{ "book-ref": bookId }} // "note-id": noteId
            onClick={close}
            aria-label="view on page"
          >
            <BiExpandAlt />
          </Link>
          <Button unstyled onClick={close}>
            <BiX />
          </Button>
        </div>
      </header>
      <div className=":uno: flex-1 overflow-x-hidden p-3">
        <Suspense>
          <Note
            bookRef={bookId as string as ID}
            noteId={noteId as string as ID}
          />
        </Suspense>
      </div>
    </section>
  );
};
