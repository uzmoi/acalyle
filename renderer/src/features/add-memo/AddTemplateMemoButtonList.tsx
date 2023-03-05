import { Button } from "@acalyle/ui";
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
            {templateNames.length === 0 ? (
                <p>No memo template.</p>
            ) : (
                <p>Create memo from template.</p>
            )}
            {templateNames.map(templateName => (
                <Button
                    key={templateName}
                    variant="unstyled"
                    onClick={addMemo}
                    data-template-name={templateName}
                >
                    {templateName}
                </Button>
            ))}
        </div>
    );
};
