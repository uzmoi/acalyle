import { Button } from "@acalyle/ui";
import { useCallback, useState } from "react";
import type { BookRef } from "~/entities/book";
import {
  MAX_DESCRIPTION_LENGTH,
  DescriptionField,
  TitleField,
  HandleField,
  useBookHandleStatus,
  normalizeBookHandle,
} from "~/features/book-form";
import { createBook } from "../model";

export const CreateBookForm: React.FC<{
  onCreatedBook: (bookRef: BookRef) => Promise<void>;
}> = ({ onCreatedBook }) => {
  const [title, setTitle] = useState("");
  const [handle, status, setHandle] = useBookHandleStatus("");
  const [description, setDescription] = useState("");
  const descriptionLength = [...description].length; // code points length

  const action = useCallback(async () => {
    const bookRef = await createBook(
      normalizeBookHandle(handle) || null,
      title,
      description,
    );
    if (bookRef.ok) {
      await onCreatedBook(bookRef.value);
    }
  }, [onCreatedBook, handle, title, description]);

  return (
    <form action={action}>
      <h1 className=":uno: text-xl">Create a new book</h1>
      <div className=":uno: my-4 flex flex-col gap-4">
        <TitleField value={title} onChange={setTitle} />
        <HandleField value={handle} status={status} onChange={setHandle} />
        <DescriptionField value={description} onChange={setDescription} />
      </div>
      <div className=":uno: text-end">
        <Button
          type="submit"
          className=":uno: bg-green-7"
          disabled={descriptionLength > MAX_DESCRIPTION_LENGTH}
        >
          Create book
        </Button>
      </div>
    </form>
  );
};
