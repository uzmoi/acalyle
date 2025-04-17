import { act, render, screen, type RenderResult } from "@testing-library/react";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ModalContainer } from "./container";
import { type Modal, createModal } from "./modal";

const renderModalContent = (data: string | void): React.ReactElement => (
  <div data-testid="content">{data ?? null}</div>
);

const renderModal = (modal: Modal<string | void, unknown>): RenderResult =>
  render(<ModalContainer modal={modal} render={renderModalContent} />);

describe("modal.open, modal.close", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("開く", async () => {
    // Arrange
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

  test("modal.close を呼ぶと閉じる", async () => {
    // Arrange
    const modal = createModal("default");
    renderModal(modal);
    const open = vi.spyOn(modal, "open");
    await act(async () => {
      void modal.open();
    });

    // Act
    let closing!: Promise<void>;
    await act(async () => {
      closing = modal.close();
    });

    // Assert
    expect(open).toHaveResolvedWith("default");

    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");

    await act(() => vi.runAllTimersAsync());
    await closing;

    expect(backdropEl.dataset.status).toBe("exited");
    expect(screen.queryByTestId("content")).toBeNull();
  });
});

describe("ユーザー操作", () => {
  const setup = async (): Promise<{ user: UserEvent; modal: Modal }> => {
    const user = userEvent.setup();

    const modal = createModal();
    renderModal(modal);
    await act(async () => {
      void modal.open();
    });

    return { user, modal };
  };

  test("Escape を押すと閉じる", async () => {
    // Arrange
    const { user } = await setup();

    // Act
    await user.keyboard("[Escape]");

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
  });

  test("modal_backdrop をクリックすると閉じる", async () => {
    // Arrange
    const { user } = await setup();

    // Act
    await user.click(screen.getByTestId("modal_backdrop"));

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
  });

  test("modal_backdrop の子をクリックしても閉じない", async () => {
    // Arrange
    const { user } = await setup();

    // Act
    const contentEl = screen.getByTestId("content");
    // eslint-disable-next-line testing-library/no-node-access
    await user.click(contentEl.parentElement!);

    // Assert
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("enter");
  });
});

describe("連続", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(async () => {
    await vi.runAllTimersAsync();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("連続して modal.open を呼ぶと順番に連続的に開く", async () => {
    // Arrange
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

  test("閉じている途中に modal.close を呼んでも作用しない", async () => {
    // Arrange
    const modal = createModal<string>();
    renderModal(modal);
    await act(async () => {
      void modal.open("first");
    });

    // Act
    await act(async () => {
      void modal.close();
      void modal.open("second");
      void modal.close();
      await vi.runAllTimersAsync();
    });

    // Assert
    expect(screen.getByTestId("content")).toHaveTextContent("second");
  });

  test("modal.open を呼んだ直後に modal.close を呼ぶと即時解決して閉じる", async () => {
    // Arrange
    const modal = createModal("default");
    const open = vi.spyOn(modal, "open");
    renderModal(modal);

    // Act
    await act(async () => {
      void modal.open();
      void modal.close();
    });

    // Assert
    expect(open).toHaveResolvedWith("default");
    const backdropEl = screen.getByTestId("modal_backdrop");
    expect(backdropEl.dataset.status).toBe("exiting");
    await act(() => vi.runAllTimersAsync());
    expect(backdropEl.dataset.status).toBe("exited");
  });

  test("modal.close を呼んだ直後に modal.open を呼ぶと完全に閉じてから開き直す", async () => {
    // Arrange
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
