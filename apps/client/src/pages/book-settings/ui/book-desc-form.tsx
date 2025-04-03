import { Button, ControlGroup, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookId } from "~/entities/book";
import { changeBookDescription } from "../model";

const MAX_DESCRIPTION_LENGTH = 500;

export const BookDescriptionForm: React.FC<{
  bookId: BookId;
  currentDescription: string;
}> = ({ bookId, currentDescription }) => {
  const id = useId();
  const [description, setDescription] = useState(currentDescription);

  const action = async (): Promise<void> => {
    await changeBookDescription(bookId, description);
  };

  return (
    <form action={action}>
      <label htmlFor={id} className=":uno: text-sm font-bold">
        Description
      </label>
      <p className=":uno: text-xs text-gray-4">
        文字数:{" "}
        <span
          className=":uno: data-[is-invalid=true]:text-red"
          data-is-invalid={description.length > MAX_DESCRIPTION_LENGTH}
        >
          {description.length} / {MAX_DESCRIPTION_LENGTH}
        </span>
      </p>
      <ControlGroup className=":uno: max-w-4xl flex">
        <TextInput
          id={id}
          value={description}
          onValueChange={setDescription}
          className=":uno: flex-grow"
        />
        <Button
          type="submit"
          disabled={description.length > MAX_DESCRIPTION_LENGTH}
        >
          Change
        </Button>
      </ControlGroup>
    </form>
  );
};
