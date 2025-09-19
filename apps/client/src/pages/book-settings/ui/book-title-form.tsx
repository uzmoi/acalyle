import { Button } from "@acalyle/ui";
import { useState } from "react";
import type { BookId } from "~/entities/book";
import { TitleField } from "~/features/book-form";
import { changeBookTitle } from "../model";

export const BookTitleForm: React.FC<{
  bookId: BookId;
  currentTitle: string;
}> = ({ bookId, currentTitle }) => {
  const [title, setTitle] = useState(currentTitle);

  const action = async (): Promise<void> => {
    await changeBookTitle(bookId, title);
  };

  return (
    <form action={action} className=":uno: flex items-end gap-4">
      <TitleField value={title} onChange={setTitle} />
      <Button type="submit">Change</Button>
    </form>
  );
};
