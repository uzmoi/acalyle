import { style } from "@acalyle/css";
import {
    Button,
    ControlGroup,
    Form,
    Modal,
    ModalContainer,
    vars,
} from "@acalyle/ui";
import { useCallback } from "react";
import { BiError } from "react-icons/bi";

const confirmModal = /* #__PURE__ */ Modal.create<string, boolean>(false);

export const confirm = (text: string) => {
    return confirmModal.open(text);
};

export const renderConfirmModal = () => (
    <ModalContainer
        modal={confirmModal}
        render={text => (
            <ConfirmForm
                text={text}
                close={ok => {
                    void confirmModal.close(ok);
                }}
            />
        )}
    />
);

const ConfirmForm: React.FC<{
    text: string;
    close: (ok: boolean) => void;
}> = ({ text, close }) => {
    const ok = useCallback(() => {
        close(true);
    }, [close]);

    const cancel = useCallback(() => {
        close(false);
    }, [close]);

    return (
        <Form onSubmit={ok} className={style({ padding: "1.25em" })}>
            <p>
                <BiError
                    className={style({
                        verticalAlign: "bottom",
                        color: vars.color.danger,
                        marginRight: "0.25em",
                        fontSize: "1.75em",
                    })}
                />
                <span className={style({ fontSize: "1.25em" })}>{text}</span>
            </p>
            <div
                className={style({
                    marginTop: "0.75em",
                    marginInline: "auto",
                    width: "fit-content",
                })}
            >
                <ControlGroup>
                    <Button onClick={cancel}>cancel</Button>
                    <Button type="submit">ok</Button>
                </ControlGroup>
            </div>
        </Form>
    );
};
