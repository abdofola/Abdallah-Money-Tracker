import {
  isToday,
  isWithinInterval,
  startOfToday,
  subDays,
} from "date-fns";


function inToday(date: Date) {
  return isToday(date);
}

function inDaysRange(date: Date, range: number) {
  const end = new Date();
  const start = subDays(startOfToday(), range);
  //const start = new Date(new Date().setDate(end.getDate() - range));
  // const inRange =
  //   date.getTime() <= end.getTime() && date.getTime() >= start.getTime();

  // return getYear(date) === getYear(end) && inRange;
  return isWithinInterval(date, { start, end });
}

export { inToday, inDaysRange };
