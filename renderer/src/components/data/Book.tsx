export const Book: React.VFC<{
    book: { title: string, createdAt: string };
}> = ({ book }) => {
    return (
        <div>
            <h2>{book.title}</h2>
            <p>{book.createdAt}</p>
        </div>
    );
};
