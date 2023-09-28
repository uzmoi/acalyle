type BackgroundStyleKey = `background${
    | ""
    | "Attachment"
    | "Clip"
    | "Color"
    | "Image"
    | "Origin"
    | "Position"
    | "Repeat"
    | "Size"}`;

type BorderStyleKey = `border${"" | "Color" | "Style" | "Width"}`;
type OutlineStyleKey = `outline${"" | "Color" | "Style" | "Width"}`;

type FontStyleKey =
    | `font${
          | ""
          | "Family"
          | "Size"
          | "Stretch"
          | "Style"
          | "Variant"
          | "Weight"}`
    | "lineHeight";

type TextStyleKey = `text${
    | "Align"
    | "AlignLast"
    | "CombineUpright"
    | "Decoration"
    | "DecorationColor"
    | "DecorationLine"
    | "DecorationSkipInk"
    | "DecorationStyle"
    | "DecorationThickness"
    | "Emphasis"
    | "EmphasisColor"
    | "EmphasisPosition"
    | "EmphasisStyle"
    | "Indent"
    | "Justify"
    | "Orientation"
    | "Overflow"
    | "Rendering"
    | "Shadow"
    | "Transform"
    | "UnderlineOffset"
    | "UnderlinePosition"}`;

type ConsoleStyleKey =
    | "margin"
    | "padding"
    | "clear"
    | "float"
    | "display"
    | BorderStyleKey
    | OutlineStyleKey
    | "borderRadius"
    | "boxDecorationBreak"
    | "boxShadow"
    | BackgroundStyleKey
    | "color"
    | "cursor"
    | FontStyleKey
    | TextStyleKey
    | "whiteSpace"
    | "wordSpacing"
    | "wordBreak"
    | "writingMode";

/**
 * @see https://developer.mozilla.org/docs/Web/API/console#styling_console_output
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
