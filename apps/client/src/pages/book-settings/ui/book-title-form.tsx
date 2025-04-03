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

  const action = async (): Promise<void> => {
    await changeBookTitle(bookId, title);
  };

  return (
    <form action={action}>
      <label htmlFor={id} className=":uno: text-sm font-bold">
        Title
      </label>
      <ControlGroup className=":uno: flex">
        <TextInput id={id} value={title} onValueChange={setTitle} required />
        <Button type="submit">Change</Button>
      </ControlGroup>
    </form>
  );
};
