import { format, isToday, subDays } from "date-fns";

type Range = [start: Date, end: Date];

function formatShort(date: Date): string {
  try {
    return format(date, "MMM d");
  } catch (err: any) {
    console.log("error message:", err.message);
    return "";
  }
}

class DateFormat {
  formatDay(date: Date = new Date()): string {
    let formatted: string;
    if (isToday(date)) formatted = "Today, ".concat(format(date, "MMMM d"));
    else formatted = format(date, "MMMM d");

    return formatted;
  }

  formatWeek(date: Date = new Date()): string {
    const to = formatShort(date);
    const from = formatShort(subDays(date, 7));

    return `${from} - ${to}`;
  }

  formatMonth(date: Date = new Date()): string {
    return format(date, "MMMM y");
  }

  formatYear(date: Date = new Date()): string {
    return format(date, "y");
  }

  formatPeriod(...range: Range) {
    const [start, end] = range;
    return `${formatShort(start)} - ${formatShort(end)}`;
  }
}

const dateFormat = new DateFormat();
export { dateFormat };
