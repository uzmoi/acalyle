import { style } from "@acalyle/css";
import { Button, Modal, ModalContainer, vars } from "@acalyle/ui";
import { Suspense } from "react";
import { BiExpandAlt, BiX } from "react-icons/bi";
import type { ID } from "~/__generated__/graphql";
import type { BookRef } from "~/book/store";
import { Note } from "~/note/ui/note";
import { link } from "~/pages/link";
import { Link } from "../Link";

type NoteModalData = {
    bookRef: BookRef;
    noteId: ID;
};

const noteModal = /* #__PURE__ */ Modal.create<NoteModalData, ID | undefined>();

export const openNoteInModal = (bookRef: BookRef, noteId: ID) => {
    return noteModal.open({ bookRef, noteId });
};

export const renderNoteModal = () => (
    <ModalContainer
        modal={noteModal}
        render={renderNoteModalContent}
        size="max"
    />
);

const close = () => {
    void noteModal.close();
};

const renderNoteModalContent = ({ bookRef, noteId }: NoteModalData) => (
    <section
        className={style({
            display: "flex",
            flexFlow: "column nowrap",
            gap: "1em",
            height: "100%",
        })}
    >
        <header
            className={style({
                display: "flex",
                flex: "0 0 2em",
                borderRadius: "1em",
                padding: "0.5em 0.75em",
                backgroundColor: vars.color.bg.layout,
                verticalAlign: "middle",
            })}
        >
            <p
                className={style({
                    flex: "1 1 auto",
                    whiteSpace: "pre",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                })}
            >
                Note /{" "}
                <span className={style({ userSelect: "all" })}>{noteId}</span>
            </p>
            <div
                className={style({
                    flex: "0 0 auto",
                    "& + &": { paddingLeft: "0.5em" },
                })}
            >
                <Link
                    to={link(":bookId/:memoId", {
                        bookId: bookRef,
                        memoId: noteId,
                    })}
                    onClick={close}
                    aria-label="view on page"
                >
                    <BiExpandAlt />
                </Link>
                <Button variant="unstyled" onClick={close}>
                    <BiX />
                </Button>
            </div>
        </header>
        <div
            className={style({
                flex: "1 1 0",
                padding: "0.75em",
                overflow: "hidden auto",
                backgroundColor: vars.color.bg.layout,
            })}
        >
            <Suspense>
                <Note bookRef={bookRef} noteId={noteId} />
            </Suspense>
        </div>
    </section>
);
