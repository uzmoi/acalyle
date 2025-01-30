import { style } from "@acalyle/css";
import { Button, Form, TextInput } from "@acalyle/ui";
import { useCallback, useId, useState } from "react";
import type { BookId } from "~/entities/book";
import { createBook } from "../model";

export const CreateBookForm: React.FC<{
  onCreatedBook: (bookId: BookId) => void;
}> = ({ onCreatedBook }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = useCallback(() => {
    void createBook(title, description).then(onCreatedBook);
  }, [onCreatedBook, title, description]);

  const htmlId = useId();
  const titleId = `${htmlId}-title`;
  const descriptionId = `${htmlId}-description`;

  return (
    <Form onSubmit={onSubmit}>
      <h1>Create a new book</h1>
      <dl>
        <dt className={DTStyle}>
          <label htmlFor={titleId} className={LabelStyle}>
            Book title
            <span className={style({ marginLeft: "0.5em" })}>(required)</span>
          </label>
        </dt>
        <dd>
          <TextInput
            id={titleId}
            className={style({
              width: "100%",
              minWidth: "16em",
              maxWidth: "32em",
            })}
            value={title}
            onValueChange={setTitle}
            required
            maxLength={32}
          />
        </dd>
        <dt className={DTStyle}>
          <label htmlFor={descriptionId} className={LabelStyle}>
            Description
          </label>
        </dt>
        <dd>
          <TextInput
            id={descriptionId}
            className={style({
              width: "100%",
              minWidth: "16em",
            })}
            value={description}
            onValueChange={setDescription}
            maxLength={500}
          />
        </dd>
      </dl>
      <div className={style({ marginTop: "1em" })}>
        <Button type="submit">Create book</Button>
      </div>
    </Form>
  );
};

const DTStyle = style({
  marginTop: "1em",
  marginBottom: "0.25em",
});

const LabelStyle = style({
  fontSize: "0.9em",
  fontWeight: "bold",
});
