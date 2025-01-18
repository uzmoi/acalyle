import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { useId } from "react";
import { changeBookHandle } from "~/book/store/book";
import type { ID } from "~/lib/graphql";
import { confirm } from "~/modal";
import { useBookHandleForm } from "../model";

export const BookHandleForm: React.FC<{
  bookId: ID;
  currentHandle: string | null;
}> = ({ bookId, currentHandle }) => {
  const id = useId();
  const { handle, setHandle, isAvailable, isChanged } =
    useBookHandleForm(currentHandle);

  const onSubmit = async () => {
    const action = handle === "" ? "削除" : `「${handle}」に変更`;
    if (await confirm(`book handleを${action}しますわ。よろしくて？`)) {
      void changeBookHandle(bookId, handle === "" ? null : handle);
    }
  };

  return (
    <Form onSubmit={() => void onSubmit()}>
      <label htmlFor={id} className=":uno: text-size-xs font-bold">
        Handle
      </label>
      <br />
      <ControlGroup>
        <TextInput
          id={id}
          value={handle}
          onValueChange={setHandle}
          minLength={1}
          aria-invalid={isChanged && !(handle === "" || isAvailable)}
        />
        <Button
          type="submit"
          disabled={!(isChanged && (handle === "" || isAvailable))}
        >
          Change
        </Button>
      </ControlGroup>
    </Form>
  );
};
