import { css } from "@linaria/core";

export const MemoInfo: React.FC<{
    createdAt: string;
    updatedAt: string;
}> = ({ createdAt, updatedAt }) => {
    return (
        <div>
            {createdAt !== updatedAt && (
                <p className={MemoInfoItemStyle}>
                    updated at{" "}
                    <time dateTime={updatedAt}>
                        {new Date(updatedAt).toLocaleDateString()}
                    </time>
                </p>
            )}
            <p className={MemoInfoItemStyle}>
                created at{" "}
                <time dateTime={createdAt}>
                    {new Date(createdAt).toLocaleDateString()}
                </time>
            </p>
        </div>
    );
};

const MemoInfoItemStyle = css`
    display: inline;
    & ~ & {
        padding-left: 0.4em;
    }
`;
