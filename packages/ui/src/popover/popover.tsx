import { cx, style } from "@acalyle/css";
import { useStore } from "@nanostores/react";
import { timeout } from "emnorst";
import { onSet } from "nanostores";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
} from "react";
import { useTransitionStatus } from "../base/use-transition-status";
import { Button } from "../control/button";
import { theme } from "../theme";
import { $popover } from "./store";

// 全ては wyw-in-js のせい。
// eslint-disable-next-line @typescript-eslint/naming-convention
const __vite_ssr_import_meta__ = { env: { DEV: true } };

const PopoverIdContext = /* #__PURE__ */ createContext<string | undefined>(
  undefined,
);

export interface PopoverProps extends React.ComponentProps<"div"> {
  onOpen?: () => void;
  onClose?: () => void;
}

export const Popover: React.FC<PopoverProps> & {
  Button: typeof PopoverButton;
  Content: typeof PopoverContent;
} = ({ className, onOpen, onClose, children, ...restProps }) => {
  const popoverId = useId();

  useEffect(() => {
    if (onOpen == null && onClose == null) return;

    return onSet($popover, ({ newValue: openedPopoverId }) => {
      const prevPopoverId = $popover.get();

      if (prevPopoverId !== popoverId && openedPopoverId === popoverId) {
        onOpen?.();
      }

      if (prevPopoverId === popoverId && openedPopoverId !== popoverId) {
        onClose?.();
      }
    });
  }, [popoverId, onOpen, onClose]);

  return (
    <div
      {...restProps}
      className={cx(style({ position: "relative" }), className)}
    >
      <PopoverIdContext value={popoverId}>{children}</PopoverIdContext>
    </div>
  );
};

export interface PopoverButtonProps
  extends Omit<
    React.ComponentProps<typeof Button>,
    "aria-expanded" | "aria-controls"
  > {}

const PopoverButton: React.FC<PopoverButtonProps> = props => {
  const popoverId = useContext(PopoverIdContext);
  const openedPopoverId = useStore($popover);
  const isOpen = popoverId === openedPopoverId;

  const { onClick } = props;
  const actualOnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      onClick?.(e);
      $popover.set($popover.get() === popoverId ? null : (popoverId ?? null));
    },
    [onClick, popoverId],
  );

  return (
    <Button
      {...props}
      aria-expanded={isOpen}
      aria-controls={popoverId}
      onClick={actualOnClick}
    />
  );
};

// eslint-disable-next-line pure-module/pure-module
Popover.Button = PopoverButton;
if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  Popover.Button.displayName = "Popover.Button";
}

const TRANSITION_DURATION = 200;
const transition = (): Promise<void> => timeout(TRANSITION_DURATION);

export interface PopoverContentProps
  extends Omit<React.ComponentProps<"div">, "id"> {
  closeOnClick?: boolean;
}

const PopoverContent: React.FC<PopoverContentProps> = ({
  closeOnClick,
  onClick,
  className,
  children,
  ...restProps
}) => {
  const popoverId = useContext(PopoverIdContext);
  const openedPopoverId = useStore($popover);
  const isOpen = popoverId === openedPopoverId;
  const status = useTransitionStatus({ show: isOpen, transition });

  const actualOnClick =
    closeOnClick ? onClick : (
      (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClick?.(e);
      }
    );

  return (
    <div
      {...restProps}
      id={popoverId}
      data-open={isOpen}
      data-status={status}
      className={cx(
        style({
          position: "absolute",
          background: theme("paper-bg"),
          border: `1px solid ${theme("paper-outline")}`,
          borderRadius: theme("paper-radius"),
          boxShadow: `2px 2px 12px ${theme("paper-shadow")}`,
          transition: `opacity ${TRANSITION_DURATION}ms`,
          '&[data-open="false"]': { opacity: 0 },
          '&[data-status="exited"]': { visibility: "hidden" },
        }),
        className,
      )}
      onClick={actualOnClick}
    >
      {status === "exited" || children}
    </div>
  );
};

// eslint-disable-next-line pure-module/pure-module
Popover.Content = PopoverContent;
if (import.meta.env.DEV) {
  // eslint-disable-next-line pure-module/pure-module
  Popover.Content.displayName = "Popover.Content";
}
