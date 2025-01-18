import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import { changeBookDescription } from "~/book/store/book";
import type { ID } from "~/lib/graphql";

export const BookDescriptionForm: React.FC<{
  bookId: ID;
  currentDescription: string;
}> = ({ bookId, currentDescription }) => {
  const id = useId();
  const [description, setDescription] = useState(currentDescription);
  const onSubmit = () => {
    void changeBookDescription(bookId, description);
  };

  const isValid = description.length <= 1024;
  const isChanged = description !== currentDescription;

  return (
    <Form onSubmit={onSubmit}>
      <label htmlFor={id} className=":uno: text-size-xs font-bold">
        Description
      </label>
      <br />
      <ControlGroup className=":uno: max-w-3xl w-full inline-flex">
        <TextInput
          id={id}
          value={description}
          onValueChange={setDescription}
          aria-invalid={isChanged && !isValid}
          className=":uno: flex-grow"
        />
        <Button type="submit" disabled={!isChanged || !isValid}>
          Change
        </Button>
      </ControlGroup>
    </Form>
  );
};
