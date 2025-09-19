import { TextInput } from "@acalyle/ui";
import { useId } from "react";

export const TitleField: React.FC<{
  value: string;
  onChange: (title: string) => void;
}> = ({ value, onChange }) => {
  const id = useId();

  return (
    // FIXME: ここに flex-grow あるのよくない。
    <div className=":uno: flex-grow line-height-none">
      <label htmlFor={id} className=":uno: mb-1 inline-block text-sm font-bold">
        Title
        <span className=":uno: ml-2">(required)</span>
      </label>
      <TextInput
        id={id}
        className=":uno: w-full"
        value={value}
        onValueChange={onChange}
        required
      />
    </div>
  );
};
