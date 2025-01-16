import { toZonedTime, format } from "date-fns-tz";

export function convertDateToTimeZone(date: Date, timeZone: string): string {
    const zonedDate = toZonedTime(date, timeZone);

    return format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", {timeZone});
}