import { Intersection, Spinner } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useStore } from "@nanostores/react";
import { bookConnection } from "~/store/book-connection";
import { BookList } from "~/ui/BookList";

const onIntersection = (entry: IntersectionObserverEntry) => {
    if (entry.isIntersecting) {
        void bookConnection.loadNext();
    }
};

export const BookListPage: React.FC = () => {
    const { isLoading } = useStore(bookConnection);

    return (
        <main className={style({ padding: "2em" })}>
            <div className={style({ display: "flex", paddingBottom: "0.5em" })}>
                {/* BookSearchBar */}
                {/* New */}
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
