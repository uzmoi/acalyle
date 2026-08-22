import { Button, Select, Spacer } from "@acalyle/ui";
import { useWebStorage } from "#/shared/web-storage";
import { Link } from "#/shared/ui";
import {
  THEME_TOKEN_KEYS,
  createThemeDefinitionStyle,
  getHexColor,
} from "#/entities/theme";
import { confirm } from "#/features/modal";
import { useState } from "react";
import { PREVIEW_PAGES, type PreviewPage } from "../model/preview";
import { themeStorage } from "../model/storage";
import { Preview } from "./preview";
import { ColorInput } from "./color-input";

// TODO: linkを扱えるようにする。

export const ThemeBuilderPage: React.FC = () => {
  const [currentTheme, setTheme, resetTheme] = useWebStorage(themeStorage);
  const [previewPage, setPreviewPage] = useState<PreviewPage>("note");

  return (
    <div className=":uno: mx-auto max-w-screen-xl px-8 py-4">
      <div className=":uno: flex gap-2">
        <Link to="/tools" className=":uno: text-lg">
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
      <Spacer size="1.25rem" />
      <div className=":uno: flex gap-4">
        <div className=":uno: flex flex-col gap-2 min-w-64">
          <div className=":uno: flex gap-4 items-center">
            <h2 className=":uno: flex-1 text-lg">Tokens</h2>
            <Button
              onClick={async () => {
                const message =
                  "編集中のテーマをリセットします。よろしいですか？";
                if (await confirm(message)) {
                  resetTheme();
                }
              }}
            >
              Reset
            </Button>
          </div>
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
          className=":uno: min-w-md flex-1 flex flex-col gap-2"
          style={createThemeDefinitionStyle(currentTheme)}
        >
          <div className=":uno: flex gap-4 items-center">
            <h2 className=":uno: flex-1 text-lg">Preview</h2>
            <Select
              value={previewPage}
              onValueChange={page => setPreviewPage(page as PreviewPage)}
            >
              {PREVIEW_PAGES.map(page => (
                <Select.Option key={page} value={page}>
                  {page}
                </Select.Option>
              ))}
            </Select>
          </div>
          <div className=":uno: flex-1">
            <Preview page={previewPage} />
          </div>
        </div>
      </div>
    </div>
  );
};
