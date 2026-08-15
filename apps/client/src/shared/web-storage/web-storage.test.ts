import { expect, test, vi } from "vitest";
import { declareStorage } from "./web-storage";

vi.useFakeTimers();

const mockedStorage = vi.mockObject(
  Object.getPrototypeOf(sessionStorage) as Storage,
);

const storage = declareStorage({
  key: "session",
  storage: mockedStorage,
  parse: value => `parsed:${value}`,
  stringify: value => `stringified:${value}`,
});

test("read", () => {
  vi.mocked(mockedStorage.getItem).mockReturnValueOnce("fuga");
  expect(storage.read()).toBe("parsed:fuga");
});

test("debounced save", async () => {
  storage.save("piyo1");
  storage.save("piyo2");
  await vi.advanceTimersToNextTimerAsync();
  expect(mockedStorage.setItem).toHaveBeenCalledExactlyOnceWith(
    "session",
    "stringified:piyo2",
  );
});

test("remove", () => {
  storage.saveRaw(null);
  expect(mockedStorage.removeItem).toHaveBeenCalledExactlyOnceWith("session");
});
