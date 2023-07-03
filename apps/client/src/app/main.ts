import { AcalyleClient } from "./client";

export let acalyle = new AcalyleClient();

if (import.meta.hot) {
    import.meta.hot.accept("./client", module => {
        if (module) {
            acalyle = new (module.AcalyleClient as typeof AcalyleClient)();
        }
    });
}
