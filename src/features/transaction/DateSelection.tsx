import React from "react";
import DatePicker, {
  CalendarContainer,
  registerLocale,
} from "react-datepicker";
import { myDate } from "@lib/utils";
import { DateSelectionProps, DateButtonProps } from "./types";
import { useRouter } from "next/router";
import ar from "date-fns/locale/ar";
import "react-datepicker/dist/react-datepicker.css";

// register arabic locale for data picker
registerLocale("ar", ar);

const DateSelection: React.FC<DateSelectionProps> = (props) => {
  const { locale } = useRouter();
  const {
    className,
    periodRef = { current: null },
    period,
    onChange,
    ...rest
  } = props;
  const { format } = myDate;
  const getCalenderTitle = (period: string) => {
    return {
      day: "select a day",
      month: "select a month",
      year: "select a year",
      period: "select start and end date",
    }[period];
  };

  return (
    <DatePicker
      withPortal={true}
      locale={locale}
      maxDate={new Date()}
      selected={props.startDate}
      onChange={(date) => onChange(date)}
      calendarContainer={({ children, className }) => {
        return (
          <CalendarContainer className={className}>
            <div className="p-2 text-center bg-blue-100 text-blue-400 text-lg font-semibold">
              {getCalenderTitle(period)}
            </div>
            <div className="relative">{children}</div>
          </CalendarContainer>
        );
      }}
      customInput={
        <DateButton
          periodRef={periodRef}
          className={className!}
          customValue={format((formatObj) => {
            const formatLookup = {
              day: formatObj.formatDay,
              week: formatObj.formatWeek,
              month: formatObj.formatMonth,
              year: formatObj.formatYear,
              period: formatObj.formatPeriod,
            };
            return formatLookup[period](props.startDate, props.endDate!);
          })}
        />
      }
      {...rest}
    />
  );
};

function DateButton(
  { periodRef, customValue, onClick, className }: DateButtonProps,
  _ref
) {
  return (
    <>
      <button
        className={className}
        type="button"
        onClick={onClick}
        ref={periodRef}
      >
        {customValue}
      </button>
    </>
  );
}

DateButton = React.forwardRef(DateButton);

export default DateSelection;
