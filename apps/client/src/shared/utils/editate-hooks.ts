import {
  type Editor,
  type PlainEditorOptions,
  createPlainEditor,
} from "editate";
import { useCallback, useEffect, useEffectEvent, useState } from "react";

type PlainDoc = {
  children: {
    children: { text: string }[];
  }[];
};

export const useEditatePlainEditor = <T extends HTMLElement>(
  options: PlainEditorOptions,
): readonly [React.Ref<T | null>, Editor<PlainDoc>] => {
  const onChange = useEffectEvent(options.onChange);

  // oxlint-disable-next-line react/hook-use-state react-hooks/rules-of-hooks
  const [editor] = useState(() => createPlainEditor({ ...options, onChange }));

  const ref: React.RefCallback<T> = useCallback(
    editorEl => {
      if (editorEl == null) return;

      return editor.input(editorEl);
    },
    [editor],
  );

  const readonly = !!options.readonly;
  useEffect(() => {
    if (readonly !== editor.readonly) {
      // oxlint-disable-next-line react/immutability
      editor.readonly = readonly;
    }
  }, [editor, readonly]);

  return [ref, editor];
};
