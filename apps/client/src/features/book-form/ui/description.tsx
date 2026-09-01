import { TextInput } from "@acalyle/ui";
import { cx, style } from "asarina";
import { useId } from "react";
import { tth } from "#/entities/theme";
import { MAX_DESCRIPTION_LENGTH } from "../model/validation";

export const DescriptionField: React.FC<{
  value: string;
  onChange: (description: string) => void;
}> = ({ value, onChange }) => {
  const descriptionLength = [...value].length; // code points length
  const id = useId();

  return (
    // FIXME: ここに flex-grow あるのよくない。
    <div className=":uno: flex-grow line-height-none">
      <label htmlFor={id} className=":uno: mb-1 inline-block text-sm font-bold">
        Description
      </label>
      <TextInput
        id={id}
        className=":uno: w-full"
        aria-invalid={descriptionLength > MAX_DESCRIPTION_LENGTH}
        value={value}
        onValueChange={onChange}
      />
      <p
        className={cx(
          ":uno: mt-1 text-xs [[aria-invalid=true]+&]:text-red",
          style(tth.style("ui-muted-text")),
        )}
      >
        {descriptionLength} / {MAX_DESCRIPTION_LENGTH} 文字
      </p>
    </div>
  );
};
