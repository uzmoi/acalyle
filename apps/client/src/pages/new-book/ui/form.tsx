import { Button, TextInput } from "@acalyle/ui";
import { useCallback, useId, useState } from "react";
import type { BookRef } from "~/entities/book";
import { createBook } from "../model";

export const CreateBookForm: React.FC<{
  onCreatedBook: (bookRef: BookRef) => void;
}> = ({ onCreatedBook }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const action = useCallback(async () => {
    const bookRef = await createBook(title, description);
    onCreatedBook?.(bookRef);
  }, [onCreatedBook, title, description]);

  const htmlId = useId();
  const titleId = `${htmlId}-title`;
  const descriptionId = `${htmlId}-description`;

  return (
    <form action={action}>
      <h1>Create a new book</h1>
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
            className=":uno: max-w-128 min-w-64 w-full"
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
            className=":uno: min-w-64 w-full"
            value={description}
            onValueChange={setDescription}
            maxLength={500}
          />
        </dd>
      </dl>
      <div className=":uno: mt-4">
        <Button type="submit">Create book</Button>
      </div>
    </form>
  );
};
