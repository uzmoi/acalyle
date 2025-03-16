import { cx } from "@acalyle/css";
import { Button, List } from "@acalyle/ui";
import { useState } from "react";
import type { NoteId } from "~/entities/note";
import { NoteContents } from "~/entities/note/ui/contents";
import { NoteContentsEditor } from "~/features/note-contents-editor";

const tabs = ["view", "editor"] as const;

export const NoteBody: React.FC<{
  noteId: NoteId;
  contents: string;
}> = ({ noteId, contents }) => {
  const [tab, setTab] = useState<(typeof tabs)[number]>("view");

  return (
    <div>
      <List>
        {tabs.map(tabName => (
          <List.Item key={tabName} className=":uno: inline-block">
            <Button
              onClick={() => setTab(tabName)}
              unstyled
              className={cx(
                ":uno: px-3 py-2px",
                tabName === tab &&
                  ":uno: border-b-2 border-b-red-600 border-b-solid bg-gray-100 bg-op-10",
                // なぜかわからないが、セレクタの優先度がいい感じにならないのでこれだけ分離
                tabName === tab && ":uno: pb-0",
              )}
            >
              {tabName}
            </Button>
          </List.Item>
        ))}
      </List>
      {tab === "view" && <NoteContents contents={contents} />}
      {tab === "editor" && (
        <NoteContentsEditor
          noteId={noteId}
          initialValue={contents}
          onEnd={() => {
            setTab("view");
          }}
        />
      )}
    </div>
  );
};
