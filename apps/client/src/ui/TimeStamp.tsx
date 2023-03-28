import { DateTime, type DurationObject, Interval } from "@rizzzse/datetime";

const dateTimeFormat = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "full",
});

const relativeTimeFormat = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
});

const units = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
] as const satisfies readonly (keyof DurationObject)[];

const formatRelative = (dur: DurationObject): string => {
    const unit = units.find(unit => dur[unit]) ?? "seconds";
    return relativeTimeFormat.format(-dur[unit], unit);
};

export const TimeStamp: React.FC<{
    dt: string;
}> = ({ dt }) => {
    const at = DateTime.from(dt);

    return (
        <time dateTime={dt} title={dateTimeFormat.format(at.valueOf())}>
            {formatRelative(Interval.from(at, DateTime.now()))}
        </time>
    );
};
