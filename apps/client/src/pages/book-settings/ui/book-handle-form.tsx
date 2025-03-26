import { Button, ControlGroup, TextInput } from "@acalyle/ui";
import { useId, useState } from "react";
import type { BookHandle, BookId } from "~/entities/book";
import { confirm } from "~/features/modal";
import {
  changeBookHandle,
  useBookHandleStatus,
  normalizeBookHandle,
} from "../model";

export const BookHandleForm: React.FC<{
  bookId: BookId;
  currentHandle: BookHandle | null;
}> = ({ bookId, currentHandle }) => {
  const id = useId();
  const [handle, setHandle] = useState<string>(currentHandle ?? "");
  const availableStatus = useBookHandleStatus(handle || null);
  const status =
    normalizeBookHandle(handle) === (currentHandle ?? "") ?
      "no-change"
    : availableStatus;

  const action = async (): Promise<void> => {
    const normalizedHandle = normalizeBookHandle(handle);
    const action = handle === "" ? "削除" : `「${normalizedHandle}」に変更`;
    if (await confirm(`book handleを${action}しますわ。よろしくて？`)) {
      await changeBookHandle(bookId, normalizedHandle || null);
    }
  };

  return (
    <form action={action}>
      <label htmlFor={id} className=":uno: text-sm font-bold">
        Handle
      </label>
      <p className=":uno: text-xs text-gray-4">
        status:{" "}
        <span
          data-testid="handle_status_message"
          className=":uno: data-[ok=false]:text-red data-[ok=true]:text-green"
          data-ok={
            status === "no-change" ? null : (
              status == null || status === "available"
            )
          }
        >
          {status == null ?
            "ハンドルを無効化します。"
          : status === "available" ?
            `${normalizeBookHandle(handle)} は使用できます。`
          : status === "unavailable" ?
            `${normalizeBookHandle(handle)} は既に使用されています。`
          : status === "invalid" ?
            // TODO[2025-06-01]: ハンドルに使用可能な文字をちゃんと決めたら書き直す。
            "ハンドルに使用できるのは英数字とアンダースコア(_)のみです。"
          : status}
        </span>
      </p>
      <ControlGroup className=":uno: flex">
        <TextInput
          id={id}
          value={handle}
          onValueChange={setHandle}
          minLength={1}
          aria-invalid={status === "invalid" || status === "unavailable"}
        />
        <Button
          type="submit"
          disabled={status === "invalid" || status === "unavailable"}
        >
          Change
        </Button>
      </ControlGroup>
    </form>
  );
};
