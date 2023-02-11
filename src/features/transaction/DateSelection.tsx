import React from "react";
import DatePicker, {
  CalendarContainer,
  ReactDatePickerProps,
} from "react-datepicker";
import { myDate } from "@lib/utils";
import { useDate } from "@components/contexts";
import { DateSelectionProps, DateButtonProps } from "./types";
import "react-datepicker/dist/react-datepicker.css";

const DateSelection: React.FC<DateSelectionProps> = ({
  className,
  date,
  selection = "day",
  periodRef = { current: null },
  setDate,
}) => {
  const { startDate, endDate, setEndDate, setStartDate } = useDate();
  const { format } = myDate;
  const props = {
    showMonthYearPicker: selection === "month",
    showYearPicker: selection === "year",
    selectsRange: selection === "period",
    startDate,
    endDate,
  };
  const handleChange: ReactDatePickerProps["onChange"] = (dates) => {
    let start = dates as Date;
    let end: Date | null = null;

    if (Array.isArray(dates)) {
      [start, end] = dates;
      setEndDate(end);
    }
    setStartDate(start);
  };
  const getCalenderTitle = (period: string) =>
    ({
      day: "select a day",
      month: "select a month",
      year: "select a year",
      period: "select start and end date",
    }[period]);

  return (
    <DatePicker
      withPortal
      selected={date ?? startDate}
      maxDate={new Date()}
      onChange={setDate ?? handleChange}
      calendarContainer={({ children, className }) => {
        return (
          <div>
            <CalendarContainer className={className}>
              <div className="p-2 text-center bg-blue-100 text-blue-400 text-lg font-semibold">
                {getCalenderTitle(selection)}
              </div>
              <div className="relative">{children}</div>
            </CalendarContainer>
          </div>
        );
      }}
      customInput={
        <DateButton
          periodRef={periodRef}
          className={className}
          customValue={format((formatObj) => {
            const formatLookup = {
              day: formatObj.formatDay,
              week: formatObj.formatWeek,
              month: formatObj.formatMonth,
              year: formatObj.formatYear,
              period: formatObj.formatPeriod,
            };
            return formatLookup[selection](date ?? startDate, endDate);
          })}
        />
      }
      {...props}
    />
  );
};

function DateButton(
  { periodRef, customValue, onClick, className }: DateButtonProps,
  _ref
) {
  return (
    <button
      className={className}
      type="button"
      name="date"
      onClick={onClick}
      ref={periodRef}
    >
      {customValue}
    </button>
  );
}

DateButton = React.forwardRef(DateButton);

export default DateSelection;
