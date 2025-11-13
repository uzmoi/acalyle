import { Button, ControlGroup, TextInput, visuallyHidden } from "@acalyle/ui";
import { useRouter } from "@tanstack/react-router";
import { startTransition, useCallback, useId } from "react";
import { BiRefresh } from "react-icons/bi";

export const SearchBar: React.FC<{
  initialQuery?: string | undefined;
}> = ({ initialQuery }) => {
  const router = useRouter();

  const setQuery = (query: string): void => {
    startTransition(async () => {
      await router.navigate({ to: "/books", search: { query } });
    });
  };

  const refetch = useCallback(() => {
    void router.invalidate();
  }, [router]);

  const id = useId();

  return (
    <form action={refetch} className=":uno: flex-1">
      <label htmlFor={id} className={visuallyHidden}>
        Search Books
      </label>
      <ControlGroup className=":uno: flex">
        <TextInput
          id={id}
          type="search"
          className=":uno: flex-1"
          placeholder="Find a book"
          defaultValue={initialQuery ?? ""}
          onValueChange={setQuery}
        />
        <Button type="submit" className=":uno: p-1">
          <BiRefresh
            title="Refresh"
            size="1.25em"
            className=":uno: align-top"
          />
        </Button>
      </ControlGroup>
    </form>
  );
};
