import { ModalContainer } from "@acalyle/ui";
import { cx, style } from "asarina";
import { themeVar } from "#/entities/theme";
import { type NoteModalInput, modal } from "../model/modal";
import { NoteModalContent } from "./content";

const renderModalContent = ({
  bookRef,
  bookId,
  noteId,
}: NoteModalInput): React.ReactNode => (
  <div
    className={cx(
      ":uno: absolute inset-16 m-auto max-w-[min(80%,96rem)] border rounded-lg b-solid",
      style({
        backgroundColor: themeVar("app-bg"),
        borderColor: themeVar("ui-border"),
      }),
    )}
  >
    <NoteModalContent bookRef={bookRef} bookId={bookId} noteId={noteId} />
  </div>
);

export const NoteModalContainer: React.FC = () => {
  return <ModalContainer modal={modal} render={renderModalContent} />;
};
