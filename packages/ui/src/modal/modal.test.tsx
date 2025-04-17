import { act, render, screen, type RenderResult } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ModalContainer } from "./container";
import { type Modal, createModal } from "./modal";

const renderModalContent = (data: string | void): React.ReactElement => (
  <div data-testid="content">{data ?? null}</div>
);

const renderModal = (modal: Modal<string | void, unknown>): RenderResult =>
  render(<ModalContainer modal={modal} render={renderModalContent} />);

describe("ModalContainer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("confirm", async () => {
    const modal = createModal(false);
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

  test("開く", async ({ onTestFinished }) => {
    // Arrange
    vi.useFakeTimers();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const modal = createModal();
    renderModal(modal);

    // Act
    await act(async () => {
      void modal.open();
    });

    // Assert
    expect(screen.getByTestId("content")).toBeVisible();
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("enter");
  });

  test("modal.close を呼ぶと閉じる", async ({ onTestFinished }) => {
    // Arrange
    vi.useFakeTimers();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const modal = createModal("default");
    renderModal(modal);
    const open = vi.spyOn(modal, "open");
    void modal.open();
    await act(() => vi.runAllTimersAsync());

    // Act
    let closing!: Promise<void>;
    act(() => {
      closing = modal.close();
    });

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
    expect(open).not.toHaveResolved();

    await act(() => vi.runAllTimersAsync());
    await closing;

    expect(backdropEl.dataset.status).toBe("exited");
    expect(open).toHaveResolvedWith("default");
    expect(screen.queryByTestId("content")).toBeNull();
  });

  test("Escape を押すと閉じる", async () => {
    // Arrange
    const modal = createModal();
    renderModal(modal);
    const user = userEvent.setup();
    await act(async () => {
      void modal.open();
    });

    // Act
    await user.keyboard("[Escape]");

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
  });

  test("modal_backdrop をクリックすると閉じる", async () => {
    // Arrange
    const modal = createModal();
    renderModal(modal);
    const user = userEvent.setup();
    await act(async () => {
      void modal.open();
    });

    // Act
    await user.click(screen.getByTestId("modal_backdrop"));

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
  });

  test("modal_backdrop の子をクリックしても閉じない", async () => {
    // Arrange
    const modal = createModal();
    renderModal(modal);
    const user = userEvent.setup();
    await act(async () => {
      void modal.open();
    });

    // Act
    const contentEl = screen.getByTestId("content");
    // eslint-disable-next-line testing-library/no-node-access
    await user.click(contentEl.parentElement!);

    // Assert
    expect(screen.getByTestId("content")).toBeVisible();
  });
});

describe("連続", () => {
  test("連続して modal.open を呼ぶと順番に連続的に開く", async ({
    onTestFinished,
  }) => {
    // Arrange
    vi.useFakeTimers();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const modal = createModal<string, string>("default");
    renderModal(modal);

    // Act
    await act(async () => {
      void modal.open("first");
      void modal.open("second");
    });

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");

    expect(backdropEl.dataset.status).toBe("enter");
    expect(screen.getByTestId("content")).toHaveTextContent("first");

    await act(async () => {
      void modal.close();
    });

    expect(backdropEl.dataset.status).toBe("enter");
    expect(screen.getByTestId("content")).toHaveTextContent("second");
    await act(() => vi.runAllTimersAsync());
    expect(backdropEl.dataset.status).toBe("enter");
  });

  test("modal.open を呼んだ直後に modal.close を呼ぶと即時解決して閉じる", async () => {
    // Arrange
    const modal = createModal("default");
    const open = vi.spyOn(modal, "open");
    renderModal(modal);

    // Act
    await act(async () => {
      void modal.open();

      // microtaskを進める
      await Promise.resolve();

      void modal.close();
    });

    // Assert
    expect(open).toHaveLastResolvedWith("default");
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exited");
    expect(screen.queryByTestId("content")).toBeNull();
  });

  test("modal.close を呼んだ直後に modal.open を呼ぶと完全に閉じてから開き直す", async ({
    onTestFinished,
  }) => {
    // Arrange
    vi.useFakeTimers();
    onTestFinished(() => {
      vi.useRealTimers();
    });
    const modal = createModal("default");
    renderModal(modal);
    void modal.open();
    await act(() => vi.runAllTimersAsync());

    // Act
    act(() => {
      void modal.close();
      void modal.open();
    });

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
    await act(() => vi.advanceTimersToNextTimerAsync());
    expect(backdropEl.dataset.status).toBe("enter");
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
    const modal = createModal<number>();
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
    const modal = createModal("defaultValue");
    const result = modal.open();
    await vi.advanceTimersByTimeAsync(0);
    void modal.close();
    expect(await result).toBe("defaultValue");
  });
});
