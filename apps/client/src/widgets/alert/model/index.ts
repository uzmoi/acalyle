import type { GqlFnError } from "#shared/graphql";

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.cause) {
    const err = error.cause as GqlFnError;

    if (err.name === "NetworkError") {
      return "ネットワークエラーが発生しました。インターネット環境をご確認ください。";
    }
  }

  return "不明なエラーが発生しました。";
};
