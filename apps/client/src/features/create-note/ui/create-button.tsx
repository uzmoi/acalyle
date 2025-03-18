import { cx, style } from "@acalyle/css";
import { Button, ControlGroup, Popover, Spinner } from "@acalyle/ui";
import { useNavigate } from "@tanstack/react-router";
import { Suspense, useCallback } from "react";
import { BiCaretDown } from "react-icons/bi";
import { type BookRef, bookRefOf, useBookByRef } from "~/entities/book";
import { createNote } from "../model";
import { NoteTemplateSelectList } from "./note-template-select-list";

export const NoteCreateButton: React.FC<{
  bookRef: BookRef;
}> = ({ bookRef }) => {
  const book = useBookByRef(bookRef);
  const navigate = useNavigate();

  const createNoteFromTemplateOrNone = useCallback(
    (templateName?: string) => {
      void createNote(book.id, templateName).then(async noteId => {
        await navigate({
          to: "/books/$book-ref/$note-id",
          params: { "book-ref": bookRefOf(book), "note-id": noteId },
        });
      });
    },
    [book, navigate],
  );

  const createNoteWithoutTemplate = useCallback(
    () => createNoteFromTemplateOrNone(),
    [createNoteFromTemplateOrNone],
  );

  return (
    <Popover className=":uno: inline-block">
      <ControlGroup>
        <Button onClick={createNoteWithoutTemplate}>Add note</Button>
        <Popover.Button aria-haspopup>
          <BiCaretDown />
        </Popover.Button>
      </ControlGroup>
      <Popover.Content
        className={style({
          top: "calc(100% + 0.5em)",
          right: 0,
          overflow: "hidden",
          minWidth: "8em",
          whiteSpace: "nowrap",
        })}
      >
        <Suspense
          fallback={
            <Spinner
              className={cx(
                ":uno: relative left-50% my-2 text-3",
                style({ translate: "-50%", "--size": "1.5em" }),
              )}
            />
          }
        >
          <NoteTemplateSelectList
            bookId={book.id}
            onSelectTemplate={createNoteFromTemplateOrNone}
          />
        </Suspense>
      </Popover.Content>
    </Popover>
  );
};
