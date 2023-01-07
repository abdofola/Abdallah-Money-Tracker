type Steps = 1 | 2 | 3;
type BarStepsProps = {
  status: {
    [key in Steps]: {
      label: string;
      active: boolean;
      valid: boolean;
    };
  };
};
type StepperFormProps = {
  steps: { label: string; active: boolean }[];
};
type NavigationBtnProps = {
  children: React.ReactNode;
  handler: any;
  disabled?: boolean;
};

export type { Steps, BarStepsProps, StepperFormProps, NavigationBtnProps };
