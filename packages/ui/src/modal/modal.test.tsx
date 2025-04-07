// eslint-disable-next-line testing-library/no-manual-cleanup
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ModalContainer } from "./container";
import { Modal } from "./modal";

describe("ModalContainer", () => {
  afterEach(() => {
    cleanup();
  });
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

    const promise = modal.open();
    fireEvent.click(await screen.findByText("Ok"));
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
  describe("status", () => {
    test("initial status is exited", () => {
      const modal = Modal.create();
      expect(modal.status.get()).toBe("exited");
    });
    test("open時のstatusの遷移", async () => {
      const modal = Modal.create();
      void modal.open();
      await vi.advanceTimersByTimeAsync(0);
      expect(modal.status.get()).toBe("entering");
      await vi.runAllTimersAsync();
      expect(modal.status.get()).toBe("entered");
    });
    test("entering中にcloseするとexitingに移行", async () => {
      const modal = Modal.create();
      void modal.open();
      await vi.advanceTimersByTimeAsync(1);
      void modal.close();
      expect(modal.status.get()).toBe("exiting");
      await vi.advanceTimersToNextTimerAsync();
      // clearTimeoutせずにenterの中断に対応しているため、
      // statusを"entered"にするタスク（中断されているためコールバックはnoop）
      // statusをと"exited"にするタスクの2つタスクが存在する。
      expect(modal.status.get()).toBe("exiting");
      await vi.runAllTimersAsync();
      expect(modal.status.get()).toBe("exited");
    });
    test("close時のstatusの遷移", async () => {
      const modal = Modal.create();
      void modal.open();
      await vi.runAllTimersAsync();
      void modal.close();
      expect(modal.status.get()).toBe("exiting");
      await vi.advanceTimersToNextTimerAsync();
      expect(modal.status.get()).toBe("exited");
    });
    test("exiting中にopenするとenteringに移行", async () => {
      const modal = Modal.create<number>();
      void modal.open(1);
      await vi.runAllTimersAsync();
      void modal.close();
      await vi.advanceTimersByTimeAsync(1);
      void modal.open(2);
      await vi.advanceTimersByTimeAsync(0);

      expect(modal.data.get()?.data).toBe(2);
      expect(modal.status.get()).toBe("entering");
      await vi.advanceTimersToNextTimerAsync();
      // clearTimeoutせずにexitの中断に対応しているため、
      // statusを"exited"にするタスク（中断されているためコールバックはnoop）
      // statusをと"entered"にするタスクの2つタスクが存在する。
      expect(modal.status.get()).toBe("entering");
      await vi.advanceTimersToNextTimerAsync();
      expect(modal.status.get()).toBe("entered");
    });
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
  test("closeは1回のみ作用する", async () => {
    const modal = Modal.create();
    void modal.open();
    await vi.runAllTimersAsync();
    void modal.close();
    await vi.advanceTimersByTimeAsync(1);
    void modal.close();
    await vi.advanceTimersByTimeAsync(1);
    void modal.open();
    await vi.advanceTimersToNextTimerAsync();
    expect(modal.status.get()).toBe("entering");
    await vi.advanceTimersToNextTimerAsync();
    expect(modal.status.get()).toBe("entered");
  });
  test("default", async () => {
    const modal = Modal.create("defaultValue");
    const result = modal.open();
    await vi.advanceTimersByTimeAsync(0);
    void modal.close();
    expect(await result).toBe("defaultValue");
  });
});
