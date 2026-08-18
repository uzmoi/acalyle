import { TextInput } from "@acalyle/ui";
import { cx, style } from "asarina";
import { useId } from "react";
import { themeVar } from "#/entities/theme";
import type { BookHandleStatus } from "../model/use-book-handle-status";
import { normalizeBookHandle } from "../model/validation";

export const HandleField: React.FC<{
  value: string;
  status: BookHandleStatus | null;
  onChange: (handle: string) => void;
}> = ({ value, status, onChange }) => {
  const id = useId();

  const ok =
    status === "no-change" ? null : status == null || status === "available";

  const statusMessage =
    status == null ? "ハンドルを無効化します。"
    : status === "available" ? `${normalizeBookHandle(value)} は使用できます。`
    : status === "unavailable" ?
      `${normalizeBookHandle(value)} は既に使用されています。`
    : status === "invalid" ?
      // TODO: ハンドルに使用可能な文字をちゃんと決めたら書き直す。
      "ハンドルに使用できるのは英数字とアンダースコア(_)のみです。"
    : status;

  return (
    // FIXME: ここに flex-grow あるのよくない。
    <div className=":uno: flex-grow line-height-none">
      <label htmlFor={id} className=":uno: mb-1 inline-block text-sm font-bold">
        Handle
      </label>
      <p
        className={cx(
          ":uno: mb-1 text-xs",
          style({ color: themeVar("ui-muted-text") }),
        )}
      >
        status:{" "}
        <span
          className=":uno: data-[ok=false]:text-red data-[ok=true]:text-green"
          data-ok={ok}
        >
          {statusMessage}
        </span>
      </p>
      <TextInput
        id={id}
        className=":uno: w-full"
        value={value}
        onValueChange={onChange}
        minLength={1}
        aria-invalid={status === "invalid" || status === "unavailable"}
      />
    </div>
  );
};
