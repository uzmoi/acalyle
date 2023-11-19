import { useBook } from "~/store/hook";

/** @package */
export const BookSettingsPage: React.FC<{
    book: string;
}> = ({ book: bookHandle }) => {
    const book = useBook(bookHandle);

    if (book == null) return null;

    return <div></div>;
};
