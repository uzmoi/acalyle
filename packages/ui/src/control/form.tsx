export const Form: React.FC<React.ComponentPropsWithoutRef<"form">> = ({
  onSubmit,
  ...restProps
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return <form {...restProps} onSubmit={handleSubmit} />;
};
