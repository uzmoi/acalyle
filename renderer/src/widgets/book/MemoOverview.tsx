import { graphql, useFragment } from "react-relay";
import { MemoOverview as MemoOverview_ } from "~/entities/memo";
import { MemoOverviewFragment$key } from "./__generated__/MemoOverviewFragment.graphql";

export { contentsHeight } from "~/entities/memo/lib/contents";

export const MemoOverview: React.FC<{
    bookId: string;
    fragmentRef: MemoOverviewFragment$key;
}> = ({ bookId, fragmentRef }) => {
    // prettier-ignore
    const memo = useFragment<MemoOverviewFragment$key>(graphql`
        fragment MemoOverviewFragment on Memo {
            id
            createdAt
            updatedAt
            contents
            tags
        }
    `, fragmentRef);

    return <MemoOverview_ bookId={bookId} memo={memo} />;
};
