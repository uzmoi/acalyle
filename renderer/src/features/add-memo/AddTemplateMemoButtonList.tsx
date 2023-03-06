import { Button } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { assert } from "emnorst";
import { useCallback } from "react";
import { graphql, useFragment } from "react-relay";
import type { AddTemplateMemoButtonList$key } from "./__generated__/AddTemplateMemoButtonList.graphql";

export type { AddTemplateMemoButtonList$key };

export const AddTemplateMemoButtonList: React.FC<{
    data: AddTemplateMemoButtonList$key;
    onMemoAdd: (templateName: string) => void;
}> = ({ data, onMemoAdd }) => {
    const { templateNames } = useFragment<AddTemplateMemoButtonList$key>(
        graphql`
            fragment AddTemplateMemoButtonList on Book {
                templateNames: tagProps(name: "template")
            }
        `,
        data,
    );

    const addMemo = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            const { templateName } = e.currentTarget.dataset;
            assert.nonNullable(templateName);
            onMemoAdd(templateName);
        },
        [onMemoAdd],
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
                        borderTop: "1px solid #666",
                        selectors: {
                            "&:not(:disabled):is(:hover, :focus)": {
                                backgroundColor: "#fff2",
                            },
                        },
                    })}
                    onClick={addMemo}
                    data-template-name={templateName}
                >
                    {templateName}
                </Button>
            ))}
        </div>
    );
};
