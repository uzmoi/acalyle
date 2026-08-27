import { Button, ControlGroup } from "@acalyle/ui";
import { useCallback } from "react";
import { BiError } from "react-icons/bi";

export const ConfirmForm: React.FC<{
  message: string;
  close: (ok: boolean) => void;
}> = ({ message, close }) => {
  const ok = useCallback(() => {
    close(true);
  }, [close]);

  const cancel = useCallback(() => {
    close(false);
  }, [close]);

  return (
    <form action={ok} className=":uno: p-5">
      <p>
        <BiError className=":uno: align-top text-red mr-1 text-3xl" />
        <span className=":uno: text-size-xl">{message}</span>
      </p>
      <div className=":uno: mx-auto mt-3 w-fit">
        <ControlGroup>
          <Button onClick={cancel}>cancel</Button>
          <Button type="submit">ok</Button>
        </ControlGroup>
      </div>
    </form>
  );
};
