import { Button, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { assert } from "emnorst";
import { useCallback } from "react";
import { usePromiseLoader } from "~/lib/promise-loader";
import { link } from "~/pages/link";
import { useBookId } from "~/store/hook";
import { Location } from "~/store/location";
import { createMemo, memoTemplateStore } from "~/store/memo";

export const CreateTemplateMemoButtonList: React.FC<{
    bookHandle: string;
}> = ({ bookHandle }) => {
    const bookId = useBookId(bookHandle);
    const templateNames =
        usePromiseLoader(useStore(memoTemplateStore(bookId))) ?? [];

    const createTemplateMemo = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const { templateName } = e.currentTarget.dataset;
            assert.nonNullable(templateName);
            void createMemo(bookId, templateName).then(memo => {
                Location.set(
                    link(":bookId/:memoId", {
                        bookId: bookHandle,
                        memoId: memo.id,
                    }),
                );
            });
        },
        [bookHandle, bookId],
    );

    return (
        <div>
            <p
                className={style({
                    padding: "0.5em",
                    fontSize: "0.75em",
                    cursor: "default",
                })}
            >
                {templateNames.length === 0
                    ? "No memo template."
                    : "Create memo from template."}
            </p>
            {templateNames.map(templateName => (
                <Button
                    key={templateName}
                    variant="unstyled"
                    className={style({
                        display: "block",
                        width: "100%",
                        padding: "0.25em 1em",
                        fontSize: "0.9em",
                        fontWeight: "normal",
                        textAlign: "start",
                        borderTop: `1px solid ${vars.color.fg.mute}`,
                        selectors: {
                            "&:enabled:is(:hover, :focus)": {
                                backgroundColor: "#fff2",
                            },
                        },
                    })}
                    onClick={createTemplateMemo}
                    data-template-name={templateName}
                >
                    {templateName}
                </Button>
            ))}
        </div>
    );
};
