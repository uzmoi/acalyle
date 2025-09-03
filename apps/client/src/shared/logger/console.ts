import { createLogFunction, cssole } from "@acalyle/cssole";
import { BasicLogLevel, type Transport } from "@acalyle/logger";

interface LevelConfig {
  name: string;
  // TODO: "Console" プロパティーを消す。こいつは @types/node 由来なのでこの読み込みをどうにか無くす。
  fn: Exclude<keyof Console, "assert" | "table" | "Console">;
  color?: string;
  bgColor?: string;
}

const levelTable: Record<BasicLogLevel, LevelConfig> =
  /* prettier-ignore */ {
  [BasicLogLevel.trace]: { name: "TRACE", fn: "debug", color:   "gray"     },
  [BasicLogLevel.debug]: { name: "DEBUG", fn: "debug", color:   "darkgray" }, // cspell:ignore darkgray
  [BasicLogLevel.info ]: { name: "INFO" , fn: "info" , color:   "#3cb371" },
  [BasicLogLevel.warn ]: { name: "WARN" , fn: "warn" , color:   "orange"   },
  [BasicLogLevel.error]: { name: "ERROR", fn: "error", color:   "red"      },
  [BasicLogLevel.fatal]: { name: "FATAL", fn: "error", bgColor: "crimson"  },
};

export const simpleConsoleTransport: Transport<
  readonly unknown[],
  BasicLogLevel
> = {
  transport({ level, name, message }) {
    const levelConfig = levelTable[level];
    const consoleFn = console[levelConfig.fn];
    const log = createLogFunction(consoleFn);
    log([
      cssole.style({
        ...(levelConfig.color && { color: levelConfig.color }),
        ...(levelConfig.bgColor && { backgroundColor: levelConfig.bgColor }),
      }),
      cssole.string(levelConfig.name),
      cssole.string(" "),
      cssole.style({ color: "peru" }),
      cssole.string(name),
      cssole.style({ color: null }),
      ...message.flatMap(message => [
        cssole.string(" "),
        cssole.object(structuredClone(message)),
      ]),
    ]);
  },
};
