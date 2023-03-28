export const TimeStamp: React.FC<{
    dt: string;
}> = ({ dt }) => {
    return (
        <time dateTime={dt} title={dt}>
            {new Date(dt).toLocaleString()}
        </time>
    );
};
