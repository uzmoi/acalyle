import { Popover, Spacer, TextInput } from "@acalyle/ui";
import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { HEX_COLOR_REGEX } from "valibot";

export const ColorInput: React.FC<{
  color: string;
  onChange: (color: string) => void;
}> = ({ color, onChange }) => {
  const [string, setString] = useState<string>();

  return (
    <Popover>
      <TextInput
        value={string ?? color}
        onValueChange={string => {
          setString(string);
          if (HEX_COLOR_REGEX.test(string)) {
            onChange(string);
          }
        }}
        onBlur={() => setString(undefined)}
        className=":uno: font-mono w-24"
      />
      <Spacer axis="horizontal" size="0.5rem" />
      <Popover.Button
        className=":uno: align-middle p-0 size-7"
        style={{ backgroundColor: color }}
        aria-label="Color picker"
      />
      <Popover.Content className=":uno: top-[calc(100%+0.25rem)] bg-transparent border-none z-1">
        <HexAlphaColorPicker color={color} onChange={onChange} />
      </Popover.Content>
    </Popover>
  );
};
