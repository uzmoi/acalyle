import { ModalContainer } from "@acalyle/ui";
import { type NoteModalInput, modal } from "../model";
import { NoteModalContent } from "./content";

const renderModalContent = ({
  bookRef,
  noteId,
}: NoteModalInput): React.ReactNode => (
  <NoteModalContent bookRef={bookRef} noteId={noteId} />
);

export const NoteModalContainer: React.FC = () => {
  return (
    <ModalContainer size="max" modal={modal} render={renderModalContent} />
  );
};
