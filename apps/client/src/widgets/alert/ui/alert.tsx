import { LuCircleAlert } from "react-icons/lu";

export const Alert: React.FC<{
  title: string;
  detail: string;
}> = ({ title, detail }) => {
  return (
    <section
      role="alert"
      className=":uno: b b-rose-5 rounded b-solid bg-rose-950 px-4 py-3 text-center"
    >
      <h2 className=":uno: mb-1 line-height-none">
        <LuCircleAlert size={24} />
        <span className=":uno: ml-2 text-base">{title}</span>
      </h2>
      <p className=":uno: text-xs">{detail}</p>
    </section>
  );
};
