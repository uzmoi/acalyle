export const cx = (...classes: (string | false | undefined | null)[]) => {
    return classes.filter(Boolean).join(" ");
};
