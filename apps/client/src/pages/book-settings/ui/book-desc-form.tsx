import { Button, ControlGroup, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookId } from "~/entities/book";
import { changeBookDescription } from "../model";

export const BookDescriptionForm: React.FC<{
  bookId: BookId;
  currentDescription: string;
}> = ({ bookId, currentDescription }) => {
  const id = useId();
  const [description, setDescription] = useState(currentDescription);
  const commit = async () => {
    await changeBookDescription(bookId, description);
  };

  return (
    <form action={commit}>
      <label htmlFor={id} className=":uno: text-xs font-bold">
        Description
      </label>
      <br />
      <ControlGroup className=":uno: max-w-3xl w-full inline-flex">
        <TextInput
          id={id}
          value={description}
          onValueChange={setDescription}
          maxLength={1024}
          className=":uno: flex-grow"
        />
        <Button type="submit" disabled={description === currentDescription}>
          Change
        </Button>
      </ControlGroup>
    </form>
  );
};
