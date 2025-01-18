import { style } from "@acalyle/css";
import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import { changeBookTitle } from "~/book/store/book";
import type { ID } from "~/lib/graphql";

export const BookTitleForm: React.FC<{
  bookId: ID;
  currentTitle: string;
}> = ({ bookId, currentTitle }) => {
  const id = useId();
  const [title, setTitle] = useState(currentTitle);
  const onSubmit = () => {
    void changeBookTitle(bookId, title);
  };

  const length = title.length;
  const isValid = 0 < length && length <= 256;
  const isChanged = title !== currentTitle;

  return (
    <Form onSubmit={onSubmit}>
      <label
        htmlFor={id}
        className={style({ fontSize: "0.75em", fontWeight: "bold" })}
      >
        Title
      </label>
      <br />
      <ControlGroup>
        <TextInput
          id={id}
          value={title}
          onValueChange={setTitle}
          required
          aria-invalid={isChanged && !isValid}
        />
        <Button type="submit" disabled={!(isChanged && isValid)}>
          Change
        </Button>
      </ControlGroup>
    </Form>
  );
};
