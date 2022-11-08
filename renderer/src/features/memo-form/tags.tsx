import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { MemoTag } from "~/entities/tag";
import { Button, Form, TextInput } from "~/shared/control";
import { tagsUpdateMutation } from "./__generated__/tagsUpdateMutation.graphql";

export const MemoTagsForm: React.FC<{
    memoId: string;
    tags: readonly string[];
    onClose: () => void;
}> = ({ memoId, tags: memoTags, onClose }) => {
    const [tags, setTags] = useState<readonly string[]>(memoTags);

    const [commit, isInFlight] = useMutation<tagsUpdateMutation>(graphql`
        mutation tagsUpdateMutation(
            $memoId: ID!
            $removeTags: [String!]!
            $updateTags: [String!]!
            $addTags: [String!]!
        ) {
            removeMemoTags(memoId: $memoId, tags: $removeTags) {
                node {
                    updatedAt
                }
            }
            updateMemoTagsArgs(memoId: $memoId, tags: $updateTags) {
                node {
                    updatedAt
                }
            }
            addMemoTags(memoId: $memoId, tags: $addTags) {
                node {
                    tags
                    updatedAt
                }
            }
        }
    `);
    const handleSubmit = () => {
        const getTagName = (tag: string) => MemoTag.fromString(tag)?.name;
        const memoTagNames = memoTags.map(getTagName);
        const tagNames = tags.map(getTagName);
        commit({
            variables: {
                memoId,
                // tags & memo.tags
                updateTags: tags.filter(tag =>
                    memoTagNames.includes(getTagName(tag)),
                ),
                // tags - memo.tags
                addTags: tags.filter(
                    tag => !memoTagNames.includes(getTagName(tag)),
                ),
                // memo.tags - tags
                removeTags: memoTags.filter(
                    tag => !tagNames.includes(getTagName(tag)),
                ),
            },
            onCompleted: onClose,
        });
    };

    const addTag = useCallback(() => setTags(tags => [...tags, ""]), []);

    return (
        <Form onSubmit={handleSubmit}>
            <ul>
                {tags.map((tag, i) => (
                    <li key={i}>
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
                    </li>
                ))}
            </ul>
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
