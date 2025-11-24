import { type Book, bookRefOf } from "#entities/book";
import { Link } from "#shared/ui";

export const BookPagesHeader: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <header>
      <h2 className=":uno: text-2xl">
        <Link
          to="/books/$book-ref"
          params={{ "book-ref": bookRefOf(book) }}
          className=":uno: decoration-none"
        >
          {book.title}
        </Link>
      </h2>
      <p className=":uno: text-xs text-gray">{book.description}</p>
    </header>
  );
};
