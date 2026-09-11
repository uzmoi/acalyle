import {
  type Editor,
  type PlainEditorOptions,
  createPlainEditor,
} from "editate";
import { useEffect, useEffectEvent, useRef, useState } from "react";

type PlainDoc = {
  children: {
    children: { text: string }[];
  }[];
};

export const useEditatePlainEditor = <T extends HTMLElement>(
  options: PlainEditorOptions,
): readonly [React.RefObject<T | null>, Editor<PlainDoc>] => {
  const editorEl = useRef<T>(null);

  const onChange = useEffectEvent(options.onChange);

  // oxlint-disable-next-line react/hook-use-state react-hooks/rules-of-hooks
  const [editor] = useState(() => createPlainEditor({ ...options, onChange }));

  useEffect(() => {
    if (editorEl.current == null) return;

    return editor.input(editorEl.current);
  }, [editor]);

  return [editorEl, editor];
};
