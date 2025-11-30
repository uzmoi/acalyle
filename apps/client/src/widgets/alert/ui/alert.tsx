import { LuCircleAlert } from "react-icons/lu";
import { getErrorMessage } from "../model";

export const Alert: React.FC<{
  title: string;
  detail?: string;
  error?: unknown;
}> = ({ title, detail, error }) => {
  return (
    <section
      role="alert"
      className=":uno: b b-rose-5 rounded b-solid bg-rose-950 px-4 py-3 text-center"
    >
      <h2 className=":uno: mb-1 line-height-none">
        <LuCircleAlert size={24} />
        <span className=":uno: ml-2 text-base">{title}</span>
      </h2>
      <p className=":uno: text-xs">{detail ?? getErrorMessage(error)}</p>
      {error instanceof Error && (
        <details className=":uno: mt-2 open:">
          <summary className=":uno: text-sm cursor-pointer">
            Error stacktrace
          </summary>
          <pre className=":uno: text-xs p-2 text-start mx-auto w-fit max-w-full overflow-auto font-mono">
            {error.stack ?? error.toString()}
          </pre>
        </details>
      )}
    </section>
  );
};
