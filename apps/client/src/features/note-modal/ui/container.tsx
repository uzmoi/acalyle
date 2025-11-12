import { cx, style } from "@acalyle/css";
import { ModalContainer, theme } from "@acalyle/ui";
import { type NoteModalInput, modal } from "../model";
import { NoteModalContent } from "./content";

const renderModalContent = ({
  bookRef,
  bookId,
  noteId,
}: NoteModalInput): React.ReactNode => (
  <div
    className={cx(
      ":uno: absolute inset-16 m-auto max-w-[min(80%,96rem)] border b-gray-8 rounded-lg b-solid",
      style({ backgroundColor: theme("app-bg") }),
    )}
  >
    <NoteModalContent bookRef={bookRef} bookId={bookId} noteId={noteId} />
  </div>
);

export const NoteModalContainer: React.FC = () => {
  return <ModalContainer modal={modal} render={renderModalContent} />;
};
