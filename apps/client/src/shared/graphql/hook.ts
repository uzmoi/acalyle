import { useSyncExternalStore } from "react";
import type {
  ConnectionSnapshot,
  GqlNode,
  GraphqlConnection,
} from "./connection";

export const useConnection = <T extends GqlNode>(
  conn: GraphqlConnection<T>,
): ConnectionSnapshot<T["id"]> => {
  return useSyncExternalStore(
    onStoreChange => conn.listen(onStoreChange),
    () => conn.toConnectionSnapshot(),
  );
};
