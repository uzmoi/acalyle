import { ModalContainer } from "@acalyle/ui";
import { type NoteModalInput, modal } from "../model";
import { NoteModalContent } from "./content";

const renderModalContent = ({ bookId, noteId }: NoteModalInput) => (
  <NoteModalContent bookId={bookId} noteId={noteId} />
);

export const NoteModalContainer: React.FC = () => {
  return (
    <ModalContainer size="max" modal={modal} render={renderModalContent} />
  );
};
