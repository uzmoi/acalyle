import { atom, onMount } from "nanostores";

export const $popover = /* #__PURE__ */ atom<string | null>(null);

export const closePopover = (): void => {
  $popover.set(null);
};

// eslint-disable-next-line pure-module/pure-module
onMount($popover, () => {
  window.addEventListener("click", closePopover);
  return () => {
    window.removeEventListener("click", closePopover);
  };
});
