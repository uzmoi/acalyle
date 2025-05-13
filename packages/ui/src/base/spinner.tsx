import { cx, keyframes, style } from "@acalyle/css";

const spin = /* #__PURE__ */ keyframes({ to: { transform: "rotate(360deg)" } });

export const Spinner: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div
      className={cx(
        style({
          width: "var(--size)",
          height: "var(--size)",
          border: "solid calc(var(--size) * 0.125)",
          borderColor: "transparent currentcolor",
          borderRadius: "50%",
          animation: `${spin} 1s ease-in-out infinite`,
        }),
        className,
      )}
    />
  );
};
