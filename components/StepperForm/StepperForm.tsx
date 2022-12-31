import React from "react";
import { formReducer, MyForm } from "@components/MyForm";
import { ArrowLeft, ArrowRight, Circle } from "@components/icons";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { actionTypes, categories, transactions } from "@lib/constants";
import { useData } from "@components/contexts";
import { useRouter } from "next/router";
import { validate } from "@lib/helpers";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { format } from "date-fns";
import { Steps, BarStepsProps, StepperFormProps, NavigationBtnProps } from './types';
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Stepper.module.css";


const initialState = {
  type: categories[0].type,
  name: categories[0].name,
  amount: "",
  date: new Date(),
  color: categories[0].color,
};

const StepperForm: React.FC<StepperFormProps> = ({ steps }) => {
  const optionsRef = React.useRef<HTMLDivElement>(null);
  const amountRef = React.useRef<HTMLDivElement>(null);
  const dateRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = React.useState<Steps>(1);
  const router = useRouter();
  const [validSteps, setValidSteps] = React.useState({
    1: false,
    2: false,
    3: false,
  });
  const [status, setStatus] = React.useState(
    steps.reduce(
      (acc, curr, idx) => (
        (acc[(idx + 1) as Steps] = {
          label: curr.label,
          active: curr.active,
          valid: false,
        }),
        acc
      ),
      {} as BarStepsProps["status"]
    )
  );
  const [formData, dispatch] = React.useReducer(formReducer, initialState);
  const { dispatch: appDispatch } = useData();
  const nextStep = step < steps.length;
  const prevStep = step > 1;
  const canCreate = Object.values(validSteps).every(Boolean);

  const handleNext = () => {
    const [valid] = validate(step, formData);
    const moveToNext = () => {
      [optionsRef, amountRef, dateRef].forEach(({ current }) => {
        current!.style.transform += `translateX(-100%)`;
      });
      setStep(step + 1);
      setStatus((prevState: any[]) => ({
        ...prevState,
        [step + 1]: { ...prevState[step + 1], active: true },
      }));
    };

    setStatus({
      ...status,
      [step]: { ...status[step], valid },
    });
    setValidSteps({
      ...validSteps,
      [step]: valid,
    });
    nextStep && valid && moveToNext();
  };

  const handlePrev = () => {
    [optionsRef, amountRef, dateRef].forEach(({ current }) => {
      current!.style.transform += `translateX(100%)`;
    });
    setStep(step - 1);
  };

  const handleChange = (name) => (e) => {
    const { value } = e.target;
    const [valid] = validate(step, { [name]: value });
    setStatus({
      ...status,
      [step]: { ...status[step as Steps], valid },
    });
    dispatch({ type: actionTypes.update, payload: { [name]: value } });
  };

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    appDispatch({
      type: actionTypes.insert,
      payload: {
        ...formData,
        color: categories.find((c) => c.name === formData.name)?.color,
      },
    });
    router.push("/summary");
  };

  const renderedSteps = () => {
    const options = (
      <div ref={optionsRef} key="options" className={styles.fieldWrapper}>
        <MyForm.Options
          data={categories}
          initialTransaction={transactions[0]}
          initialCategory={categories[0]}
          dispatch={dispatch}
        />
      </div>
    );
    const amount = (
      <div ref={amountRef} key="amount" className={styles.fieldWrapper}>
        <MyForm.Field
          key="amount"
          id="amount"
          type="number"
          label="enter amount"
          value={formData.amount}
          onChange={handleChange("amount")}
        />
      </div>
    );
    const date = (
      <div ref={dateRef} key="date" className={styles.fieldWrapper}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="select date"
            value={formData.date}
            onChange={(value) => handleChange("date")({ target: { value } })}
            renderInput={(params) => {
              const { label, onClick } = params;
              return (
                <MyForm.Field
                  key="date"
                  id="date"
                  label={label as string}
                  onClick={onClick}
                  defaultValue={format(new Date(formData.date), "yyyy-MM-dd")}
                />
              );
            }}
          />
        </LocalizationProvider>
      </div>
    );

    return [options, amount, date];
  };

  return (
    <>
      <StepsBar status={status} />
      <MyForm
        onSubmit={handleSubmit}
        className="flex flex-col gap-y-8 shadow-md m-4 p-4 w-full max-w-lg"
      >
        <div className="flex overflow-x-clip">{renderedSteps()}</div>
        {canCreate && (
          <MyForm.Button disabled={!Object.values(formData).every(Boolean)}>
            create
          </MyForm.Button>
        )}
      </MyForm>
      <div className="flex gap-6 items-center">
        <NavigationButton key="prev" handler={handlePrev} disabled={!prevStep}>
          prev
        </NavigationButton>
        <NavigationButton key="next" handler={handleNext}>
          {nextStep ? "next" : "finish"}
        </NavigationButton>
      </div>
    </>
  );
};

const StepsBar: React.FC<BarStepsProps> = ({ status }) => {
  const renderedSteps = Object.entries(status).map(
    ([_, { label, active, valid }]) => (
      <span
        key={label}
        className={styles.indecator}
        data-active={active}
        data-valid={valid}
      >
        {label}
      </span>
    )
  );

  return <div className="flex w-full justify-center">{renderedSteps}</div>;
};

const NavigationButton: React.FC<NavigationBtnProps> = ({
  children,
  handler,
  disabled,
}) => {
  const arrowLeft = <ArrowLeft />;
  const arrowRight = <ArrowRight />;

  return (
    <button
      data-label={children}
      disabled={disabled}
      className={styles.btn}
      onClick={handler}
    >
      <span className={styles.label}>{children}</span>
      {children !== "finish" && (
        <div className="relative inline-flex w-14 h-14 flex-none items-center justify-center p-1">
          <div className="absolute text-gray-200">
            <Circle className={styles.circle} />
          </div>
          <span className={styles.arrow}>
            {children === "next" ? arrowRight : arrowLeft}
          </span>
        </div>
      )}
    </button>
  );
};

export default StepperForm;
