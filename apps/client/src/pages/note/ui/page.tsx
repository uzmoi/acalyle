import { Suspense } from "react";
import type { BookRef } from "~/entities/book";
import type { NoteId } from "~/entities/note";
import { FullNote } from "~/widgets/note";

export const NotePage: React.FC<{
  bookRef: BookRef;
  noteId: NoteId;
}> = ({ noteId }) => {
  return (
    <div>
      <Suspense>
        <FullNote noteId={noteId} />
      </Suspense>
    </div>
  );
};
