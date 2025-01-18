import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BiLeftArrowAlt } from "react-icons/bi";
import { type Book, bookRefOf } from "~/book/store";
import { CreateBookForm } from "~/features/create-book";

const RouteComponent: React.FC = () => {
  const navigate = useNavigate();

  const onCreatedBook = (book: Book) => {
    void navigate({
      to: "/books/$book-id",
      params: { "book-id": bookRefOf(book) },
    });
  };

  return (
    <div className=":uno: px-8 py-4">
      <Link to="/books" className=":uno: color-inherit decoration-none">
        <BiLeftArrowAlt />
        <span className=":uno: ml-1 align-middle">Return to books</span>
      </Link>
      <hr className=":uno: my-2 border-gray-7 border-none border-t-solid" />
      <CreateBookForm onCreatedBook={onCreatedBook} />
    </div>
  );
};

export const Route = /* #__PURE__ */ createFileRoute("/books/new")({
  component: RouteComponent,
});
