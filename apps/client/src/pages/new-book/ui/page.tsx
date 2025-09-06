import { Link, useNavigate } from "@tanstack/react-router";
import { BiLeftArrowAlt } from "react-icons/bi";
import type { BookRef } from "~/entities/book";
import { CreateBookForm } from "./form";

export const NewBookPage: React.FC = () => {
  const navigate = useNavigate();

  const onCreatedBook = async (bookRef: BookRef): Promise<void> => {
    await navigate({
      to: "/books/$book-ref",
      params: { "book-ref": bookRef },
    });
  };

  return (
    <div className=":uno: mx-auto w-screen-md px-8 py-4">
      <Link
        to="/books"
        className=":uno: text-sm color-inherit decoration-none transition-colors hover:text-indigo"
      >
        <BiLeftArrowAlt />
        <span className=":uno: ml-1 align-bottom">Return to books</span>
      </Link>
      <hr className=":uno: mb-3 mt-1 border-gray-7 border-none border-t-solid" />
      <CreateBookForm onCreatedBook={onCreatedBook} />
    </div>
  );
};
