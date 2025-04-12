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

    await expect(promise).resolves.toBe(true);
  });

  test("Escape を押すと閉じる", async () => {
    // Arrange
    const modal = Modal.create("default");
    const renderModalContent = (): React.ReactElement => (
      <div data-testid="content" />
    );
    render(<ModalContainer modal={modal} render={renderModalContent} />);
    const user = userEvent.setup();
    const promise = modal.open();

    // Act
    await user.keyboard("[Escape]");

    // Assert
    await expect(promise).resolves.toBe("default");
    expect(screen.queryByTestId("content")).toBeNull();
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
