import StyleProcessor from "./style.js";

// eslint-disable-next-line import/no-default-export
export default class KeyframesProcessor extends StyleProcessor {
    get asSelector() {
        return `@keyframes ${this.className}`;
    }
}
