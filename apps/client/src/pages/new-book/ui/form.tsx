import { Button, TextInput } from "@acalyle/ui";
import { useCallback, useId, useState } from "react";
import type { BookRef } from "~/entities/book";
import { MAX_DESCRIPTION_LENGTH } from "~/features/book-form";
import { createBook } from "../model";

export const CreateBookForm: React.FC<{
  onCreatedBook: (bookRef: BookRef) => Promise<void>;
}> = ({ onCreatedBook }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const descriptionLength = [...description].length; // code points length

  const action = useCallback(async () => {
    const bookRef = await createBook(title, description);
    if (bookRef.ok) {
      await onCreatedBook(bookRef.value);
    }
  }, [onCreatedBook, title, description]);

  const htmlId = useId();
  const titleId = `${htmlId}-title`;
  const descriptionId = `${htmlId}-description`;

  return (
    <form action={action}>
      <h1 className=":uno: text-xl">Create a new book</h1>
      <dl>
        <dt className=":uno: mb-1 mt-4">
          <label htmlFor={titleId} className=":uno: text-sm font-bold">
            Book title
            <span className=":uno: ml-2">(required)</span>
          </label>
        </dt>
        <dd>
          <TextInput
            id={titleId}
            className=":uno: w-full"
            value={title}
            onValueChange={setTitle}
            required
            maxLength={32}
          />
        </dd>
        <dt className=":uno: mb-1 mt-4">
          <label htmlFor={descriptionId} className=":uno: text-sm font-bold">
            Description
          </label>
        </dt>
        <dd>
          <TextInput
            id={descriptionId}
            className=":uno: w-full"
            aria-invalid={descriptionLength > MAX_DESCRIPTION_LENGTH}
            value={description}
            onValueChange={setDescription}
          />
          <p className=":uno: mt-1 text-xs text-gray [[aria-invalid=true]+&]:text-red">
            {descriptionLength} / {MAX_DESCRIPTION_LENGTH} 文字
          </p>
        </dd>
      </dl>
      <div className=":uno: mt-4 text-end">
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
