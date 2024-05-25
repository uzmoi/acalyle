import { cx, style } from "@acalyle/css";

export const Spacer: React.FC<
    {
        size?: number | string;
        axis?: "horizontal" | "vertical";
    } & React.ComponentPropsWithoutRef<"div">
> = ({ size, axis = "vertical", style: styles, className, ...restProps }) => {
    return (
        <div
            className={cx(style({ display: "inline-block" }), className)}
            style={
                axis === "vertical" ?
                    { height: size, ...styles }
                :   { width: size, ...styles }
            }
            data-space-axis={axis}
            {...restProps}
        />
    );
};
