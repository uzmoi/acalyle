import { atom, onMount } from "nanostores";

export const $popover = /* #__PURE__ */ atom<string | null>(null);

export const closePopover = (): void => {
  $popover.set(null);
};

// eslint-disable-next-line pure-module/pure-module
onMount($popover, () => {
  const onKeyDown = (e: KeyboardEvent): void => {
    if (!e.defaultPrevented && e.key === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      closePopover();
    }
  };
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("click", closePopover);
  return () => {
    window.removeEventListener("keydown", onKeyDown);
    window.removeEventListener("click", closePopover);
  };
});
