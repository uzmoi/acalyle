import { cx, style } from "@acalyle/css";
import { Button, vars } from "@acalyle/ui";
import { useStore } from "@nanostores/react";
import { useCallback } from "react";
import type { BookId } from "~/entities/book";
import type { ID } from "~/lib/graphql";
import { usePromiseLoader } from "~/lib/promise-loader";
import { noteTemplateStore } from "~/note/store/note";

export const NoteTemplateSelectList: React.FC<{
  bookId: BookId;
  onSelectTemplate?: (templateName: string) => void;
}> = ({ bookId, onSelectTemplate }) => {
  const store = noteTemplateStore(bookId as string as ID);
  const templateNames = usePromiseLoader(useStore(store)) ?? [];

  const selectTemplate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { templateName } = e.currentTarget.dataset;
      // SAFETY: onClick と一緒に data-template-name を指定している。
      onSelectTemplate?.(templateName!);
    },
    [onSelectTemplate],
  );

  return (
    <div>
      <p className=":uno cursor-default p-2 text-3">
        {templateNames.length === 0 ?
          "No note template."
        : "Create note from template."}
      </p>
      {templateNames.map(templateName => (
        <Button
          key={templateName}
          unstyled
          className={cx(
            ":uno: block w-full px-3 py-1 text-align-start text-3",
            style({
              borderTop: `1px solid ${vars.color.fg.mute}`,
              "&:enabled:is(:hover, :focus)": {
                backgroundColor: "#fff2",
              },
            }),
          )}
          onClick={selectTemplate}
          data-template-name={templateName}
        >
          {templateName}
        </Button>
      ))}
    </div>
  );
};
