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
