import { Button } from "@acalyle/ui";
import { useState } from "react";
import type { BookId } from "~/entities/book";
import { MAX_DESCRIPTION_LENGTH, DescriptionField } from "~/features/book-form";
import { changeBookDescription } from "../model";

export const BookDescriptionForm: React.FC<{
  bookId: BookId;
  currentDescription: string;
}> = ({ bookId, currentDescription }) => {
  const [description, setDescription] = useState(currentDescription);

  const action = async (): Promise<void> => {
    await changeBookDescription(bookId, description);
  };

  return (
    <form action={action} className=":uno: max-w-4xl flex items-end gap-4">
      <DescriptionField value={description} onChange={setDescription} />
      <Button
        type="submit"
        className=":uno: mb-5"
        disabled={description.length > MAX_DESCRIPTION_LENGTH}
      >
        Change
      </Button>
    </form>
  );
};
