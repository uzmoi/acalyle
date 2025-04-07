export interface SpacerProps extends React.ComponentProps<"div"> {
  size?: number | string;
  axis?: "horizontal" | "vertical";
}

export const Spacer: React.FC<SpacerProps> = ({
  size,
  axis = "vertical",
  style,
  ...restProps
}) => {
  return (
    <div
      style={
        axis === "vertical" ?
          { height: size, ...style }
        : { width: size, display: "inline-block", ...style }
      }
      data-space-axis={axis}
      {...restProps}
    />
  );
};
