import { Tag, TagType, tagTypeTable } from "./tag";

export const parseTag = (tagString: string): Tag | null => {
    const type = (tagTypeTable as Record<string, TagType | undefined>)[tagString[0]];
    let status: "name" | "args" | "done" = "name";
    let name = "";
    let arg = "";
    const args: string[] = [];
    for(let i = type == null ? 0 : 1; i < tagString.length; i++) {
        const char = tagString[i];
        switch(status) {
        case "name":
            if(char === "(") {
                if(type === "control") {
                    status = "args";
                    break;
                }
                // normalに引数は無い
                return null;
            }
            if(char === ")") {
                return null;
            }
            name += char;
            break;
        case "args":
            if(char === "(") {
                return null;
            }
            if(char === ")") {
                if(i !== tagString.length - 1) {
                    // 入力を消費しきっていない
                    return null;
                }
                if(arg !== "") {
                    args.push(arg.trim());
                    arg = "";
                }
                status = "done";
                break;
            }
            if(char === ",") {
                args.push(arg.trim());
                arg = "";
                break;
            }
            arg += char;
            break;
        }
    }
    if(name === "" || status === "args") {
        // unexpected end of input.
        return null;
    }
    return {
        type: type ?? "normal",
        name,
        args: args.length === 0 ? null : args,
    };
};
