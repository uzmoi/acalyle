import { TextInput } from "@acalyle/ui";
import { useId } from "react";
import { MAX_DESCRIPTION_LENGTH } from "../model";

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
      <p className=":uno: mt-1 text-xs text-gray [[aria-invalid=true]+&]:text-red">
        {descriptionLength} / {MAX_DESCRIPTION_LENGTH} 文字
      </p>
    </div>
  );
};
