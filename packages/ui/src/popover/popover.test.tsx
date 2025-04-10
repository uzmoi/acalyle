import {
  act,
  render,
  screen,
  within,
  type RenderResult,
} from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";
import {
  closePopover,
  Popover,
  type PopoverContentProps,
  type PopoverProps,
} from ".";

const renderPopover = (
  props: PopoverProps & PopoverContentProps = {},
): RenderResult =>
  render(
    <Popover onOpen={props.onOpen} onClose={props.onClose}>
      <Popover.Button aria-haspopup>open</Popover.Button>
      <Popover.Content closeOnClick={props.closeOnClick}>
        content
      </Popover.Content>
    </Popover>,
  );

describe("開閉動作", () => {
  test("開く", async () => {
    // Arrange
    renderPopover();
    const user = userEvent.setup();

    // Act
    const button = screen.getByRole("button");
    await user.click(button);

    // Assert
    expect(screen.getByText("content")).toBeVisible();
  });

  test("closePopover を呼ぶと閉じる", async () => {
    // Arrange
    renderPopover();
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    // Act
    act(() => {
      closePopover();
    });

    // Assert
    expect(screen.queryByText("content")).toBeNull();
  });

  test("Escape を押すと閉じる", async () => {
    // Arrange
    renderPopover();
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    // Act
    await user.keyboard("[Escape]");

    // Assert
    expect(screen.queryByText("content")).toBeNull();
  });

  test("開いている状態で <Popover.Button /> を押すと閉じる", async () => {
    // Arrange
    renderPopover();
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    // Act
    await user.click(button);

    // Assert
    expect(screen.queryByText("content")).toBeNull();
  });

  test("<Popover.Content /> の外をクリックすると閉じる", async () => {
    // Arrange
    const { container } = renderPopover();
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    // Act
    await user.click(container);

    // Assert
    expect(screen.queryByText("content")).toBeNull();
  });

  test("<Popover.Content /> をクリックしても閉じない", async () => {
    // Arrange
    renderPopover();
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    // Act
    await user.click(screen.getByText("content"));

    // Assert
    expect(screen.getByText("content")).toBeVisible();
  });

  test("closeOnClick が true なら <Popover.Content /> をクリックすると閉じる", async () => {
    // Arrange
    renderPopover({ closeOnClick: true });
    const user = userEvent.setup();
    const button = screen.getByRole("button");
    await user.click(button);

    // Act
    await user.click(screen.getByText("content"));

    // Assert
    expect(screen.queryByText("content")).toBeNull();
  });

  test("開いている状態で別の <Popover.Button /> を押すと下のほうは閉じて別の方が開く", async () => {
    // Arrange
    const { container: container1 } = renderPopover();
    const { container: container2 } = renderPopover();
    const user = userEvent.setup();
    const [button1, button2] = screen.getAllByRole("button") as [
      HTMLElement,
      HTMLElement,
    ];
    await user.click(button1);

    // Act
    await user.click(button2);

    // Assert
    expect(within(container1).queryByText("content")).toBeNull();
    expect(within(container2).getByText("content")).toBeVisible();
  });
});

describe("onOpen, onClose", () => {
  test("onOpen, onClose", async () => {
    const onOpen = vi.fn();
    const onClose = vi.fn();
    renderPopover({ onOpen, onClose });
    const user = userEvent.setup();
    const button = screen.getByRole("button");

    await user.click(button);
    expect(onOpen).toHaveBeenCalledOnce();
    expect(onClose).not.toHaveBeenCalled();
    await user.click(button);
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("Popover が複数あるとき", async () => {
    const onOpen1 = vi.fn();
    const onClose1 = vi.fn();
    const onOpen2 = vi.fn();
    const onClose2 = vi.fn();
    renderPopover({ onOpen: onOpen1, onClose: onClose1 });
    renderPopover({ onOpen: onOpen2, onClose: onClose2 });
    const user = userEvent.setup();
    const [button1, button2] = screen.getAllByRole("button") as [
      HTMLElement,
      HTMLElement,
    ];

    // Popover1 を開く (onOpen1)
    await user.click(button1);

    expect(onOpen1).toHaveBeenCalledOnce();
    expect(onOpen2).not.toHaveBeenCalled();
    onOpen1.mockReset();

    // Popover1 を閉じて Popover2 を開く (onClose1, onOpen2)
    await user.click(button2);

    expect(onClose1).toHaveBeenCalledOnce();
    expect(onClose2).not.toHaveBeenCalled();

    expect(onOpen1).not.toHaveBeenCalled();
    expect(onOpen2).toHaveBeenCalledOnce();

    // 現在の実装ではPopoverをrenderした順に実行される。
    // expect(onClose1).toHaveBeenCalledBefore(onOpen2);
  });
});
