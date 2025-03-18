import { Button, ControlGroup, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookId } from "~/entities/book";
import { changeBookTitle } from "../model";

export const BookTitleForm: React.FC<{
  bookId: BookId;
  currentTitle: string;
}> = ({ bookId, currentTitle }) => {
  const id = useId();
  const [title, setTitle] = useState(currentTitle);
  const commit = async () => {
    await changeBookTitle(bookId, title);
  };

  return (
    <form action={commit}>
      <label htmlFor={id} className=":uno: text-xs font-bold">
        Title
      </label>
      <br />
      <ControlGroup className=":uno: inline-flex">
        <TextInput
          id={id}
          value={title}
          onValueChange={setTitle}
          required
          maxLength={256}
        />
        <Button type="submit" disabled={title === currentTitle}>
          Change
        </Button>
      </ControlGroup>
    </form>
  );
};
