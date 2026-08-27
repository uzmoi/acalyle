import { useNavigate } from "@tanstack/react-router";
import { cx, style } from "asarina";
import { BiLeftArrowAlt } from "react-icons/bi";
import { Link } from "#/shared/ui";
import type { BookRef } from "#/entities/book";
import { themeVar } from "#/entities/theme";
import { CreateBookForm } from "./form";

export const NewBookPage: React.FC = () => {
  const navigate = useNavigate();

  const onCreatedBook = async (bookRef: BookRef): Promise<void> => {
    await navigate({
      to: "/books/$bookRef",
      params: { bookRef },
    });
  };

  return (
    <div className=":uno: mx-auto w-screen-md px-8 py-4">
      <Link
        to="/books"
        className=":uno: text-sm decoration-none transition-colors hover:text-indigo"
      >
        <BiLeftArrowAlt />
        <span className=":uno: ml-1 align-bottom">Return to books</span>
      </Link>
      <hr
        className={cx(
          ":uno: mb-3 mt-1 border-none border-t-solid",
          style({ borderColor: themeVar("ui-border") }),
        )}
      />
      <CreateBookForm onCreatedBook={onCreatedBook} />
    </div>
  );
};
