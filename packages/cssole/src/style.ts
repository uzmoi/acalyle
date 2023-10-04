type BackgroundStyleKey = `background${
    | ""
    | "Attachment"
    | "BlendMode"
    | "Clip"
    | "Color"
    | "Image"
    | "Origin"
    | `Position${"" | "X" | "Y"}`
    | "Repeat"
    | "Size"}`;

type BorderRadiusStyleKey = `border${
    | ""
    | `${"Start" | "End"}${"Start" | "End"}`
    | `${"Top" | "Bottom"}${"Left" | "Right"}`}Radius`;

type BorderPosition =
    | ""
    | ("Top" | "Bottom" | "Left" | "Right")
    | `${"Inline" | "Block"}${"" | "Start" | "End"}`;
type BorderStyleKey =
    | `border${BorderPosition}${"" | "Color" | "Style" | "Width"}`
    | `borderImage${"" | "Outset" | "Repeat" | "Slice" | "Source" | "Width"}`;

type OutlineStyleKey = `outline${"" | "Color" | "Style" | "Width" | "Offset"}`;

type FontStyleKey =
    | `font${
          | ""
          | "Family"
          | "Size"
          | "Stretch"
          | "Style"
          | "Variant"
          | "Weight"
          | "Kerning"
          | "Palette"
          | "FeatureSettings"
          | "LanguageOverride"
          | "OpticalSizing"
          | "SizeAdjust"
          | "Smooth"
          | `Synthesis${"" | "Position" | "SmallCaps" | "Style" | "Weight"}`
          | `Variant${
                | ""
                | "Alternates"
                | "Caps"
                | "EastAsian"
                | "Ligatures"
                | "Numeric"
                | "Position"}`
          | "VariationSettings"}`
    | "lineHeight";

type TextStyleKey = `text${
    | `Align${"" | "Last"}`
    | "CombineUpright"
    | `Decoration${"" | "Color" | "Line" | "SkipInk" | "Style" | "Thickness"}`
    | `Emphasis${"" | "Color" | "Position" | "Style"}`
    | "Indent"
    | "Justify"
    | "Orientation"
    | "Overflow"
    | "Rendering"
    | "Shadow"
    | "Transform"
    | `Underline${"Offset" | "Position"}`}`;

type ConsoleStyleKey =
    | (`margin${BorderPosition}` | `padding${BorderPosition}`)
    | ("clear" | "float")
    | "display"
    | (BorderStyleKey | OutlineStyleKey | BorderRadiusStyleKey)
    | "boxDecorationBreak"
    | "boxShadow"
    | BackgroundStyleKey
    | "color"
    | "cursor"
    | FontStyleKey
    | TextStyleKey
    | "whiteSpace"
    | `word${"Spacing" | "Break"}`
    | "writingMode";

/**
 * @see https://developer.mozilla.org/docs/Web/API/console#styling_console_output
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/consistent-type-definitions
export interface ConsoleStyle extends Record<ConsoleStyleKey, string | null> {}

export const printConsoleStyle = (style: Partial<ConsoleStyle>): string => {
    const css = [];
    for (const [key, value] of Object.entries(style)) {
        if (value != null) {
            // camelCase -> kebab-case
            const property = key
                .split(/(?<![A-Z])(?=[A-Z])/)
                .join("-")
                .toLowerCase();
            css.push(`${property}:${value}`);
        }
    }
    return css.join(";");
};
