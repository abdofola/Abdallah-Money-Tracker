import React from "react";
import { useRouter } from "next/router";
import { ar, en } from "@locales";
import { ArrowLeft, ArrowRight, Circle } from "@components/icons";
import styles from "./stepper.module.css";

type StepperProps = {
  steps: { id: number; Component: JSX.Element; completed: boolean }[];
  className?: string;
/** callback function that's executed after all the steps have been completed */
  cb?: () => void;
};

export default function Stepper({
  steps,
  className,
  cb = () => {},
}: StepperProps) {
  const elemsRef = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const [step, setStep] = React.useState(0);
  const { locale } = useRouter();
  const isNext = step < steps.length - 1;
  const isPrevious = step > 0;
  const isFinished =
    step === steps.length - 1 && steps[steps.length - 1].completed;
  const translation = locale === "en" ? en : ar;

  const handleNext = () => {
    if (!steps[step].completed) return;

    setStep(step + 1);
  };
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // scorll the component - that corresponds to current step - into view.
  React.useEffect(() => {
    const elem = elemsRef.current.get(step);
    elem.scrollIntoView({ behavior: "smooth" });
  }, [locale, step]);

  // console.log({ elemsRef });

  return (
    <div className={className}>
      <div className="flex w-full overflow-hidden">
        {steps.map(({ id, Component }, idx) => (
          <div
            key={id}
            ref={(elem) => elem && elemsRef.current.set(idx, elem)}
            className="flex basis-full shrink-0"
          >
            {Component}
          </div>
        ))}
      </div>
      {/* buttons */}
      <div className="flex w-full px-2">
        {isPrevious && (
          <button
            type="button"
            className={styles.circle}
            onClick={handlePrevious}
          >
            <Circle />
            {translation.stepper.previous}
            <span className="absolute ltr:left-5 rtl:right-5 text-black">
              {locale === "en" ? <ArrowLeft /> : <ArrowRight />}
            </span>
          </button>
        )}
        {isNext && (
          <button
            type="button"
            className={styles.circle.concat(" ltr:ml-auto rtl:mr-auto")}
            onClick={handleNext}
          >
            {translation.stepper.next}
            <Circle />
            <span className="absolute ltr:right-5 rtl:left-5 text-black">
              {locale === "en" ? <ArrowRight /> : <ArrowLeft />}
            </span>
          </button>
        )}
        {isFinished && (
          <button
            type="button"
            className={styles.circle.concat(" ltr:ml-auto rtl:mr-auto")}
            onClick={cb}
          >
            {translation.stepper.finished}
            <Circle />
            <span className="absolute ltr:right-5 rtl:left-5 text-black">
              {locale === "en" ? <ArrowRight /> : <ArrowLeft />}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
