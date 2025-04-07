export const Spacer: React.FC<
  {
    size?: number | string;
    axis?: "horizontal" | "vertical";
  } & React.ComponentPropsWithoutRef<"div">
> = ({ size, axis = "vertical", style, ...restProps }) => {
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
