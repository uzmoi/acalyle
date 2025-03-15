import { Button, ControlGroup, Form, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookHandle, BookId } from "~/entities/book";
import { confirm } from "~/features/modal";
import { changeBookHandle, useBookHandleStatus } from "../model";

export const BookHandleForm: React.FC<{
  bookId: BookId;
  currentHandle: BookHandle | null;
}> = ({ bookId, currentHandle }) => {
  const id = useId();
  const [handle, setHandle] = useState<string>(currentHandle ?? "");
  const availableStatus = useBookHandleStatus(handle || null);
  const isChanged = handle !== (currentHandle ?? "");

  const commit = async () => {
    const action = handle === "" ? "削除" : `「${handle}」に変更`;
    if (await confirm(`book handleを${action}しますわ。よろしくて？`)) {
      await changeBookHandle(bookId, handle || null);
    }
  };

  return (
    <Form onSubmit={() => void commit()}>
      <label htmlFor={id} className=":uno: text-xs font-bold">
        Handle
      </label>
      <br />
      <ControlGroup className=":uno: inline-flex">
        <TextInput
          id={id}
          value={handle}
          onValueChange={setHandle}
          minLength={1}
          aria-invalid={
            isChanged &&
            (availableStatus === "invalid" || availableStatus === "unavailable")
          }
        />
        <Button
          type="submit"
          disabled={!isChanged && availableStatus !== "available"}
        >
          Change
        </Button>
      </ControlGroup>
    </Form>
  );
};
