import { isSameDay, isSameMonth, isSameYear, subDays } from "date-fns";


class DateFilter {
  inThisDateDay(date: Date, selectedDate: Date = new Date()): boolean {
    return isSameDay(date, selectedDate);
  }
  inThisDateWeek(date: Date, selectedDate: Date = new Date()): boolean {
    const from = subDays(selectedDate, 7);
    const to = selectedDate;

    return date >= from && date <= to;
  }
  inThisDateMonth(date: Date, selectedDate: Date = new Date()): boolean {
    return isSameMonth(date, selectedDate);
  }
  inThisDateYear(date: Date, selectedDate: Date = new Date()): boolean {
    return isSameYear(date, selectedDate);
  }
  inThisDatePeriod(date: Date, start: Date, end: Date): boolean {
    return date >= start && date <= end;
  }
}

export const dateFilter = new DateFilter();
