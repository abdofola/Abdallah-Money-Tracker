import React from "react";
import {
  format,
  formatDistanceToNow,
  formatRelative,
  isSameDay,
  isSameWeek,
  parseISO,
} from "date-fns";

type Formatter = (date: Date) => string;
type TimeAgoProps = { timestamp: string };

const formatToday: Formatter = (date) => {
  // return `${formatDistanceToNow(date)} ago`;
  return "today";
};
const formatWithinInterval: Formatter = (date) => format(date, "do, MMM");
function chooseFormatter(date: Date) {
  const today = new Date();
  if (isSameDay(date, today)) return formatToday(date);
  return formatWithinInterval(date);
}

const TimeAgo: React.FC<TimeAgoProps> = ({ timestamp }) => {
  let fomratedDate = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    fomratedDate = chooseFormatter(date);
  }

  return (
    <span title={timestamp}>
      <i>{fomratedDate}</i>
    </span>
  );
};

export default TimeAgo;
