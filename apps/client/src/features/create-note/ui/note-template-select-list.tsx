import { cx, style } from "@acalyle/css";
import { Button, vars } from "@acalyle/ui";
import { memoize } from "es-toolkit";
import { use, useCallback } from "react";
import type { BookId } from "~/entities/book";
import { fetchTemplate } from "../api";

const memoizedFetchTemplate = /* #__PURE__ */ memoize(fetchTemplate);

export const NoteTemplateSelectList: React.FC<{
  bookId: BookId;
  onSelectTemplate?: (templateName: string) => Promise<void>;
}> = ({ bookId, onSelectTemplate }) => {
  const templates = use(memoizedFetchTemplate(bookId)).unwrapOrThrow();

  const selectTemplate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const { templateName } = e.currentTarget.dataset;
      // SAFETY: onClick と一緒に data-template-name を指定している。
      void onSelectTemplate?.(templateName!);
    },
    [onSelectTemplate],
  );

  return (
    <div>
      <p className=":uno: cursor-default p-2 text-3">
        {templates.length === 0 ?
          "No note template."
        : "Create note from template."}
      </p>
      {templates.map(templateName => (
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
