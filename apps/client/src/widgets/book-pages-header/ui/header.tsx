import { LuSettings } from "react-icons/lu";
import { Link } from "#shared/ui";
import { type Book, bookRefOf } from "~/entities/book";

export const BookPagesHeader: React.FC<{
  book: Book;
}> = ({ book }) => {
  return (
    <header className=":uno: flex gap-4">
      <div className=":uno: flex-1">
        <h2 className=":uno: mb-2 text-3xl">{book.title}</h2>
        <p className=":uno: text-xs text-gray-400">{book.description}</p>
      </div>
      <div>
        <Link
          to="/books/$book-ref/settings"
          params={{ "book-ref": bookRefOf(book) }}
        >
          <LuSettings size={24} title="Settings" />
        </Link>
      </div>
    </header>
  );
};
