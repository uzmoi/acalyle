import { cx, style } from "@acalyle/css";
import { Alert, Catch, vars } from "@acalyle/ui";
import { Suspense } from "react";
import { BiError } from "react-icons/bi";
import type { Book } from "~/entities/book";
import type { NoteId } from "~/entities/note";
import { FullNote } from "~/widgets/note";

export const NotePage: React.FC<{
  book: Book;
  noteId: NoteId;
}> = ({ noteId }) => {
  return (
    <div>
      <Suspense>
        <Catch
          fallback={
            // REVIEW: role="alert"ってこういう所で使っていいものなのか
            <Alert type="error">
              <BiError
                className={cx(
                  ":uno: text-7 mr-1",
                  style({ color: vars.color.danger }),
                )}
              />
              <span className=":uno: align-middle">Note not found!</span>
              <p>
                note id: <span className=":uno: select-all">{noteId}</span>
              </p>
            </Alert>
          }
        >
          <FullNote noteId={noteId} />
        </Catch>
      </Suspense>
    </div>
  );
};
