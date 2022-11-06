import { css } from "@linaria/core";

export const MemoInfo: React.FC<{
    createdAt: string;
    updatedAt: string;
}> = ({ createdAt, updatedAt }) => {
    return (
        <div>
            {createdAt !== updatedAt && (
                <p className={MemoInfoItemStyle}>
                    updated at {new Date(updatedAt).toLocaleDateString()}
                </p>
            )}
            <p className={MemoInfoItemStyle}>
                created at {new Date(createdAt).toLocaleDateString()}
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
