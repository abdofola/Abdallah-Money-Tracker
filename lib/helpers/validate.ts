import { TransactionKeys } from "@components/MyForm";

type Fields = {
  [key in TransactionKeys]?: string;
} & { checker?: () => void | (() => boolean) };
type Steps = 1 | 2 | 3;
export type V = { [key in Steps]?: boolean };

export default (function validate() {
  let validation: V = { 1: false, 2: false, 3: false };
  const checkOption = (type: string, name: string) => () => !!type && !!name;
  const checkAmount = (amount: string) => Number(amount) > 0;
  const checkColor = (color: string) => !!color;
  const checkStep2 = (amount: string, color: string) => () => {
    return checkAmount(amount) && checkColor(color);
  };
  const checkDate = (date: string) => () => {
    const newDate = new Date(date);
    return (
      newDate &&
      Object.prototype.toString.call(newDate) === "[object Date]" &&
      !isNaN(Number(newDate))
    );
  };

  return function validate(step: Steps, fields: Fields) {
    const { type, name, amount, color, date, checker } = fields;
    validation[step] = new Map<number, any>([
      // the checker function it inverts the control to the user when checking fields.
      [1, checker?.() ?? checkOption(type!, name!)],
      [2, checker?.() ?? checkStep2(amount!, color!)],
      [3, checker?.() ?? checkDate(date!)],
    ]).get(step)();

    return [validation[step], validation] as const;
  };
})();
