import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ModalContainer } from "./container";
import { Modal } from "./modal";

describe("ModalContainer", () => {
  test("confirm", async () => {
    const modal = Modal.create(false);
    const renderModal = (): React.ReactElement => (
      <div>
        <button type="button" onClick={() => void modal.close()}>
          Cancel
        </button>
        <button type="button" onClick={() => void modal.close(true)}>
          Ok
        </button>
      </div>
    );
    render(<ModalContainer modal={modal} render={renderModal} />);
    const user = userEvent.setup();

    const promise = modal.open();
    await user.click(await screen.findByText("Ok"));
    expect(await promise).toBe(true);
  });
  test("esc", async () => {
    const modal = Modal.create(false);
    const { container } = render(
      <ModalContainer modal={modal} render={() => null} />,
    );
    const user = userEvent.setup();

    void modal.open();
    await user.click(container);
    await user.keyboard("[Escape]");
    // eslint-disable-next-line testing-library/no-node-access
    const rootEl = container.firstChild as HTMLElement;
    expect(rootEl.dataset.status).toBe("exiting");
  });
});

describe("class Modal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.restoreAllMocks();
  });
  test("entering/entered中にopenした時の挙動", async () => {
    const modal = Modal.create<number>();
    const first = modal.open(1);
    const second = modal.open(2);
    await vi.runAllTimersAsync();
    expect(modal.data.get()?.data).toBe(1);
    void modal.close();
    await vi.runAllTimersAsync();
    expect(modal.data.get()?.data).toBe(2);
    await expect(first).resolves.toBeUndefined();
    void modal.close();
    await vi.runAllTimersAsync();
    await expect(second).resolves.toBeUndefined();
  });
  test("default", async () => {
    const modal = Modal.create("defaultValue");
    const result = modal.open();
    await vi.advanceTimersByTimeAsync(0);
    void modal.close();
    expect(await result).toBe("defaultValue");
  });
});
