import {
    type ConsoleFunctionType,
    createLogFunction,
    cssole,
} from "@acalyle/cssole";
import { BasicLogLevel, type Transport } from "@acalyle/logger";
import { DateTime } from "@rizzzse/datetime";
import { acalyle } from "~/app/main";
import type { JsonValueable } from "~/lib/types";

type ConsoleFnName = {
    [P in keyof Console]: Console[P] extends ConsoleFunctionType ? P : never;
}[keyof Console];

type LevelConfig = {
    name: string;
    fn: ConsoleFnName;
    color?: string;
    bgColor?: string;
};

const levelTable: Record<BasicLogLevel, LevelConfig> =
    /* prettier-ignore */ {
    [BasicLogLevel.trace]: { name: "TRACE", fn: "debug", color:   "gray"     },
    [BasicLogLevel.debug]: { name: "DEBUG", fn: "debug", color:   "darkgray" },
    [BasicLogLevel.info ]: { name: "INFO" , fn: "info" , color:   "#3cb371"  },
    [BasicLogLevel.warn ]: { name: "WARN" , fn: "warn" , color:   "orange"   },
    [BasicLogLevel.error]: { name: "ERROR", fn: "error", color:   "red"      },
    [BasicLogLevel.fatal]: { name: "FATAL", fn: "error", bgColor: "crimson"  },
};

const cloneJson = (value: unknown): unknown =>
    JSON.parse(JSON.stringify(value));

const simpleConsoleTransport: Transport<
    readonly JsonValueable[],
    BasicLogLevel
> = {
    transport({ level, name, message, timeStamp }) {
        const levelConfig = levelTable[level];
        const consoleFn = console[levelConfig.fn];
        const log = createLogFunction(consoleFn);
        log([
            cssole.style({ color: "gray" }),
            cssole.string(
                DateTime.fromMillis(timeStamp).toString().replace("T", " "),
            ),
            cssole.string(" "),
            cssole.style({
                color: levelConfig.color,
                backgroundColor: levelConfig.bgColor,
            }),
            cssole.string(levelConfig.name),
            cssole.string(" "),
            cssole.style({ color: "peru" }),
            cssole.string(name),
            cssole.style({ color: null }),
            ...message.flatMap(message => [
                cssole.string(" "),
                cssole.object(cloneJson(message)),
            ]),
        ]);
    },
};

acalyle.context.logger.attachTransport(simpleConsoleTransport);
