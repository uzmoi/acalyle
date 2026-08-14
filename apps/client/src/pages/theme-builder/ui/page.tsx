import { Button, Spacer } from "@acalyle/ui";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { FALLBACK_THEME, THEME_TOKEN_KEYS, getHexColor } from "../model/theme";
import { Preview } from "./preview";
import { ColorInput } from "./color-input";

// TODO: linkを扱えるようにする。

export const ThemeBuilderPage: React.FC = () => {
  const [currentTheme, setTheme] = useState(FALLBACK_THEME);

  return (
    <div className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <div className=":uno: flex gap-2">
        <Link to="/tools" className=":uno: text-lg text-inherit">
          tools
        </Link>
        <span className=":uno: text-lg">/</span>
        <h1 className=":uno: text-xl">Theme Builder</h1>
        <Button
          className=":uno: ml-auto"
          onClick={() => {
            const json = JSON.stringify(currentTheme, null, "  ");
            void navigator.clipboard.writeText(json);
          }}
        >
          Copy as JSON
        </Button>
      </div>
      <Spacer size="2rem" />
      <div className=":uno: flex gap-4">
        <div className=":uno: flex flex-col gap-2 min-w-64">
          {THEME_TOKEN_KEYS.map(key => (
            <div key={key} className=":uno: flex gap-4 items-center">
              <p className=":uno: flex-1 text-base">{key}</p>
              <ColorInput
                color={getHexColor(currentTheme, key)}
                onChange={color => {
                  setTheme(theme => ({ ...theme, [key]: color }));
                }}
              />
            </div>
          ))}
        </div>
        <div
          className=":uno: min-w-md flex-1"
          style={Object.fromEntries(
            THEME_TOKEN_KEYS.map(key => [
              `--${key}`,
              getHexColor(currentTheme, key),
            ]),
          )}
        >
          <Preview />
        </div>
      </div>
    </div>
  );
};
