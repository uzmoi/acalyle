import { AcalyleMemoTag } from "@acalyle/core";
import { Button, Form, List, TextInput } from "@acalyle/ui";
import { nonNullable } from "emnorst";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import type { tagsUpdateMutation } from "./__generated__/tagsUpdateMutation.graphql";

export const MemoTagsForm: React.FC<{
    memoId: string;
    tags: readonly string[];
    onClose: () => void;
}> = ({ memoId, tags: memoTags, onClose }) => {
    const [tags, setTags] = useState<readonly string[]>(memoTags);

    const [commit, isInFlight] = useMutation<tagsUpdateMutation>(graphql`
        mutation tagsUpdateMutation(
            $memoId: ID!
            $removeSymbols: [String!]!
            $upsertTags: [String!]!
        ) {
            removeMemoTags(memoIds: [$memoId], symbols: $removeSymbols) {
                id
            }
            upsertMemoTags(memoIds: [$memoId], tags: $upsertTags) {
                id
                tags
                updatedAt
            }
        }
    `);
    const handleSubmit = () => {
        const getTagSymbol = (tag: string) =>
            AcalyleMemoTag.fromString(tag)?.symbol;
        const memoTagSymbols = memoTags.map(getTagSymbol).filter(nonNullable);
        const symbols = new Set(tags.map(getTagSymbol).filter(nonNullable));

        commit({
            variables: {
                memoId,
                removeSymbols: memoTagSymbols.filter(
                    symbol => !symbols.has(symbol),
                ),
                upsertTags: tags,
            },
            onCompleted: onClose,
        });
    };

    const addTag = useCallback(() => setTags(tags => [...tags, ""]), []);

    return (
        <Form onSubmit={handleSubmit}>
            <List>
                {tags.map((tag, i) => (
                    <List.Item key={i}>
                        <TextInput
                            value={tag}
                            onValueChange={value => {
                                const newTags = tags.slice();
                                newTags[i] = value;
                                setTags(newTags);
                            }}
                        />
                        <Button
                            onClick={() => {
                                const newTags = tags.slice();
                                newTags.splice(i, 1);
                                setTags(newTags);
                            }}
                        >
                            remove
                        </Button>
                    </List.Item>
                ))}
            </List>
            <Button onClick={addTag} disabled={isInFlight}>
                add
            </Button>
            <Button onClick={onClose} disabled={isInFlight}>
                cancel
            </Button>
            <Button type="submit" disabled={isInFlight}>
                save
            </Button>
        </Form>
    );
};
