import { Button, Popover, Select, Spacer, TextInput } from "@acalyle/ui";
import { cx, style } from "asarina";
import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { LuLink, LuUnlink } from "react-icons/lu";
import {
  THEME_TOKEN_KEYS,
  type Theme,
  type ThemeTokenKey,
  type ThemeTokenValue,
  getColor,
  isColor,
  isLinkTokenValue,
  normalizeColor,
  tth,
} from "#/entities/theme";

export const ThemeTokenRow: React.FC<{
  tokenKey: ThemeTokenKey;
  theme: Theme;
  onChange: (value: ThemeTokenValue) => void;
}> = ({ tokenKey, theme, onChange }) => {
  const [string, setString] = useState<string>();

  const value = theme[tokenKey];
  const color = getColor(theme, tokenKey);

  if (isLinkTokenValue(value)) {
    return (
      <Popover className=":uno: flex gap-3 items-center">
        <Button
          className=":uno: align-middle p-0 size-7"
          onClick={() => onChange(color)}
        >
          <LuLink
            className=":uno: align-bottom [:is(:hover,:focus-visible)>&]:hidden"
            title="Unlink"
          />
          <LuUnlink
            className=":uno: align-bottom [:not(:hover,:focus-visible)>&]:hidden"
            title="Unlink"
          />
        </Button>
        <div className=":uno: font-mono">
          <p>{tokenKey}</p>
          <p className={cx(":uno: text-xs", style(tth.style("ui-muted-text")))}>
            {/* slice で先頭の '$' を取り除く */}
            Linked to {value.slice(1)}
          </p>
        </div>
      </Popover>
    );
  }

  const hexColor: `#${string}` = color === "transparent" ? "#0000" : color;

  return (
    <Popover className=":uno: flex gap-3 items-center">
      <Popover.Button
        className=":uno: align-middle p-0 size-7"
        style={{ backgroundColor: color }}
        aria-label="Color picker"
      />
      <Popover.Content className=":uno: top-[calc(100%+0.25rem)] z-1 p-2">
        <HexAlphaColorPicker
          color={hexColor}
          // onChange の引数は color に有効な hex color を渡す限り hex color
          onChange={onChange as (newColor: string) => void}
        />
        <Spacer size="0.5rem" />
        <TextInput
          value={string ?? color}
          onValueChange={string => {
            setString(string);
            if (isColor(string)) {
              onChange(string);
            }
          }}
          onBlur={() => setString(undefined)}
          className=":uno: font-mono w-[200px]"
        />
        <Spacer size="0.5rem" />
        <Select
          className=":uno: font-mono w-[200px]"
          defaultValue=""
          // オプションは全て有効なリンク
          onValueChange={onChange as (value: string) => void}
          aria-label="Link"
        >
          <Select.Option value="" disabled className=":uno: hidden">
            Link
          </Select.Option>
          {THEME_TOKEN_KEYS.map(key => (
            <Select.Option
              key={key}
              value={`$${key}`}
              disabled={key === tokenKey || isLinkTokenValue(theme[key])}
            >
              {key}
            </Select.Option>
          ))}
        </Select>
      </Popover.Content>
      <div className=":uno: font-mono">
        <p>{tokenKey}</p>
        <p className={cx(":uno: text-xs", style(tth.style("ui-muted-text")))}>
          {normalizeColor(color)}
        </p>
      </div>
    </Popover>
  );
};
