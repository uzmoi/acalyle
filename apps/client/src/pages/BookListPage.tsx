import { Intersection, Spinner } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { BiBookAdd } from "react-icons/bi";
import { bookConnection } from "~/store/book-connection";
import { BookList } from "~/ui/BookList";
import { BookSearchBar } from "~/ui/BookSearchBar";
import { Link } from "~/ui/Link";
import { link } from "./link";

const onIntersection = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
        void bookConnection.loadNext();
    }
};

export const BookListPage: React.FC = () => {
    const { isLoading } = useStore(bookConnection);

    return (
        <main className={style({ padding: "1.25em" })}>
            <div
                className={style({
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1.5em",
                })}
            >
                <div className={style({ flex: "1 1" })}>
                    <BookSearchBar />
                </div>
                <Link to={link("new")} className={style({ marginLeft: "1em" })}>
                    <BiBookAdd className={style({ verticalAlign: "middle" })} />
                    <span className={style({ marginLeft: "0.25em" })}>New</span>
                </Link>
            </div>
            <BookList />
            <Intersection
                onIntersection={onIntersection}
                rootMargin="25% 0px"
            />
            {isLoading && (
                <div
                    className={style({
                        display: "inline-block",
                        marginTop: "1em",
                        marginLeft: "50%",
                        transform: "translateX(-50%)",
                    })}
                >
                    <span
                        className={style({
                            height: "1em",
                            marginRight: "4em",
                            verticalAlign: "top",
                        })}
                    >
                        Loading...
                    </span>
                    <Spinner
                        className={style({ vars: { "--size": "1.5em" } })}
                    />
                </div>
            )}
        </main>
    );
};
