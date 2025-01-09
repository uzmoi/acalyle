import { style } from "@acalyle/css";
import { Button, ControlGroup, Form, vars } from "@acalyle/ui";
import { useCallback } from "react";
import { BiError } from "react-icons/bi";

export const ConfirmForm: React.FC<{
    message: string;
    close: (ok: boolean) => void;
}> = ({ message, close }) => {
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
                <span className={style({ fontSize: "1.25em" })}>{message}</span>
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
