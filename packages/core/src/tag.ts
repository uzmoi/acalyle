export class AcalyleMemoTag {
    static fromString(this: void, tagString: string): AcalyleMemoTag | null {
        const headChar = tagString.charAt(0);
        const hasHead = "#@".includes(headChar);
        const head = hasHead ? headChar : "#";
        const i = head === "@" ? tagString.indexOf(":") : -1;
        const name = tagString.slice(+hasHead, i === -1 ? tagString.length : i);
        if (name === "") {
            return null;
        }
        const prop = tagString.slice(i + 1 || tagString.length) || null;
        return new AcalyleMemoTag(head + name, prop);
    }
    constructor(
        readonly symbol: string,
        readonly prop: string | null,
    ) {}
    toString(this: this): string {
        return this.symbol + (this.prop ? ":" + this.prop : "");
    }
}
