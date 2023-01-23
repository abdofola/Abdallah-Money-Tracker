import { dateFormat } from "./DateFormat";
import { dateFilter } from "./DateFilter";

type FormatCallBack = (obj: typeof dateFormat) => string;

const myDateFormat = {
  format: (cb: FormatCallBack) => {
    return cb(dateFormat);
  },
  filter: dateFilter,
};

export default myDateFormat;
