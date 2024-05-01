import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../control";
import { Modal, ModalContainer } from "./modal";

export default {
    title: "Base/Modal",
    component: ModalContainer,
    parameters: {
        layout: "fullscreen",
    },
    render: props => (
        <div style={{ height: "8em" }}>
            <Button
                onClick={() => {
                    void props.modal.open(() => {
                        void props.modal.close();
                    });
                }}
            >
                open
            </Button>
            <ModalContainer {...props} />
        </div>
    ),
    args: {
        render: close => (
            <div style={{ padding: "1em" }}>
                <p>Modal contents</p>
                <Button onClick={close}>close</Button>
            </div>
        ),
    },
} satisfies Meta<typeof ModalContainer<() => void>>;

type Story = StoryObj<typeof ModalContainer>;

export const Max: Story = {
    args: {
        modal: Modal.create(),
        size: "max",
    },
};

export const Content: Story = {
    args: {
        modal: Modal.create(),
        size: "content",
    },
};
