import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";
import { parseTag } from "~/entities/tag";
import { Button, TextInput } from "~/shared/control";
import { tagsUpdateMutation } from "./__generated__/tagsUpdateMutation.graphql";

export const MemoTagsForm: React.FC<{
    bookId: string;
    memoId: string;
    tags: readonly string[];
    onClose: () => void;
}> = ({ bookId, memoId, tags: memoTags, onClose }) => {
    const [tags, setTags] = useState<readonly string[]>(memoTags);

    const [commit, isInFlight] = useMutation<tagsUpdateMutation>(graphql`
        mutation tagsUpdateMutation(
            $bookId: ID!,
            $memoId: ID!,
            $removeTags: [String!]!,
            $updateTags: [String!]!,
            $addTags: [String!]!,
        ) {
            removeMemoTags(bookId: $bookId, memoId: $memoId, tags: $removeTags) {
                node {
                    updatedAt
                }
            }
            updateMemoTagsArgs(bookId: $bookId, memoId: $memoId, tags: $updateTags) {
                node {
                    updatedAt
                }
            }
            addMemoTags(bookId: $bookId, memoId: $memoId, tags: $addTags) {
                node {
                    tags
                    updatedAt
                }
            }
        }
    `);
    const handleSubmit = () => {
        const getTagName = (tag: string) => parseTag(tag)?.name;
        const memoTagNames = memoTags.map(getTagName);
        const tagNames = tags.map(getTagName);
        commit({
            variables: {
                bookId,
                memoId,
                // tags & memo.tags
                updateTags: tags.filter(tag => memoTagNames.includes(getTagName(tag))),
                // tags - memo.tags
                addTags: tags.filter(tag => !memoTagNames.includes(getTagName(tag))),
                // memo.tags - tags
                removeTags: memoTags.filter(tag => !tagNames.includes(getTagName(tag))),
            },
            onCompleted: onClose,
        });
    };

    const addTag = useCallback(() => setTags(tags => [...tags, ""]), []);

    return (
        <form onSubmit={handleSubmit}>
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
            <Button onClick={addTag} disabled={isInFlight}>add</Button>
            <Button onClick={onClose} disabled={isInFlight}>cancel</Button>
            <Button disabled={isInFlight}>save</Button>
        </form>
    );
};