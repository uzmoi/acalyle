interface ServerError {
  name: "ServerError";
  status: number;
  body: string;
}

interface NetworkError {
  name: "NetworkError";
  error: unknown;
}

interface InvalidResponseError {
  name: "InvalidResponseError";
}

interface NotFoundError {
  name: "NotFoundError";
}

export type GqlFnError =
  | ServerError
  | NetworkError
  | InvalidResponseError
  | NotFoundError;
