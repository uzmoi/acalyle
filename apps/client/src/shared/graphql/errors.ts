interface ServerError {
  name: "ServerError";
}

interface NetworkError {
  name: "NetworkError";
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
