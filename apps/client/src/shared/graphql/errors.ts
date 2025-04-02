interface ServerError {
  name: "ServerError";
}

interface NetworkError {
  name: "NetworkError";
}

interface InvalidResponseError {
  name: "InvalidResponseError";
}

export type GqlFnError = ServerError | NetworkError | InvalidResponseError;
