import { Button, ControlGroup, Form, openModal, vars } from "@acalyle/ui";
import { style } from "@macaron-css/core";
import { useCallback } from "react";
import { BiError } from "react-icons/bi";

export const confirm = (text: string) => {
    return openModal({
        default: false,
        render: close => <ConfirmForm text={text} close={close} />,
    });
};

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
                        color: vars.color.denger,
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