import { Button } from "@acalyle/ui";
import { useNavigate } from "@tanstack/react-router";
import { startTransition } from "react";
import { type BookHandle, type BookId, bookRefFromId } from "~/entities/book";
import {
  normalizeBookHandle,
  useBookHandleStatus,
  HandleField,
} from "~/features/book-form";
import { confirm } from "~/features/modal";
import { changeBookHandle } from "../model";

export const BookHandleForm: React.FC<{
  bookId: BookId;
  currentHandle: BookHandle | null;
}> = ({ bookId, currentHandle }) => {
  const navigate = useNavigate();
  const [handle, status, setHandle] = useBookHandleStatus(currentHandle);

  const action = async (): Promise<void> => {
    const normalizedHandle = normalizeBookHandle(handle);
    const action = handle === "" ? "削除" : `「${normalizedHandle}」に変更`;
    if (await confirm(`book handleを${action}しますわ。よろしくて？`)) {
      await changeBookHandle(bookId, normalizedHandle || null);
      startTransition(async () => {
        await navigate({
          to: "/books/$book-ref/settings",
          params: { "book-ref": normalizedHandle || bookRefFromId(bookId) },
        });
      });
    }
  };

  return (
    <form action={action} className=":uno: flex items-end gap-4">
      <HandleField value={handle} status={status} onChange={setHandle} />
      <Button
        type="submit"
        disabled={status === "invalid" || status === "unavailable"}
      >
        Change
      </Button>
    </form>
  );
};
