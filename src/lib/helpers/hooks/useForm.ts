import * as React from "react";
import useSsr from "./useSsr";

type Elem = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
type Config =
  | React.InputHTMLAttributes<Elem>
  | React.TextareaHTMLAttributes<Elem>
  | React.SelectHTMLAttributes<Elem>;

type CustomConfig = {
  errorMsg?: string;
  isControlled?: boolean;
  ref?: React.LegacyRef<Elem>;
  type?: React.HTMLInputTypeAttribute;
} & Config;
type Handler<P> = (data: P) => any;
type FormSubmit = React.FormEventHandler<HTMLFormElement>;
type CustomSubmit<T> = (cb: Handler<T>) => FormSubmit;
type State<U> = { data: U; errors: U };
type Action<A> =
  | {
      type: "data" | "errors";
      payload: Partial<A>;
    }
  | { type: "reset"; payload?: (data: A) => A };
export type Register = (name: string, config: CustomConfig) => Config;

// TODO:
// add locale for error messages.
export function useForm<T extends { [k: string]: any }>(initalState?: T) {
  const customErrorRef = React.useRef<T>({} as T);
  const initialState = {
    data: {...initalState} as T,
    errors: {} as T,
  };
  const [formState, dispatch] = React.useReducer(reducer, initialState);
  const { isBrowser } = useSsr();

  /** function that runs on input's change event */
  const onChange = React.useCallback(
    (e: React.ChangeEvent<Elem>) => {
      dispatch({
        type: "data",
        payload: { [e.target.name]: e.target.value } as T,
      });
      const control = e.target;

      if (control.validity.valid && formState.errors[e.target.name]) {
        // in case the control is valid, then empty the error message
        dispatch({
          type: "errors",
          payload: { [e.target.name]: "" } as Partial<T>,
        });
      } else {
        dispatch({
          type: "errors",
          payload: {
            [e.target.name]: e.target.validationMessage,
          } as Partial<T>,
        });
      }
    },
    [formState.errors]
  );

  /** function to register your component into the hook */
  const register: Register = React.useCallback(
    (name, config) => {
      const { errorMsg, isControlled, ...rules } = config;
      const checkBoxOrRadio =
        rules.type === "radio" || rules.type === "checkbox";

      if (errorMsg) {
        //@ts-ignore
        customErrorRef.current[name] = errorMsg;
      }

      if (!isControlled) {
        return { ...rules, name };
      }

      return {
        ...rules,
        name,
        value: checkBoxOrRadio ? config.value : formState.data[name as keyof T],
        onChange: (e) => {
          onChange(e);
          config.onChange?.(e);
        },
      };
    },
    [onChange, formState.data]
  );

  /** function that runs on form submission */
  const onSubmit: CustomSubmit<T> = React.useCallback(
    (handler) => {
      return (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        const controls = form.elements;
        const data = new FormData(form);
        const formJson = Object.fromEntries(data);
        const allFields = { ...formState.data, ...formJson };
        //console.log({ formJson });

        // loop through the controlled elements
        for (let k in allFields) {
          // handle the errors state here
          const control = controls.namedItem(k) as Elem | RadioNodeList;

          if (control instanceof RadioNodeList) {
            // the control is of type `radio`
            const item = control.item(0) as Elem;
            if (item.validity && !item.validity.valid) {
              dispatch({
                type: "errors",
                payload: {
                  [k]: customErrorRef.current[k] ?? item.validationMessage,
                } as Partial<T>,
              });
            }

            continue;
          }

          if (control.validity && !control.validity.valid) {
            dispatch({
              type: "errors",
              payload: {
                [k]: customErrorRef.current[k] ?? control.validationMessage,
              } as Partial<T>,
            });
          }
        }

        // console.log({ "form checkValidity": form.checkValidity() });

        // call the `hanlder` if, and only if there's no error.
        if (form.checkValidity()) handler(allFields);
      };
    },
    [formState.data]
  );

  /** function that resets form values */
  const reset = React.useCallback((cb?: (args: T) => T) => {
    dispatch({ type: "reset", payload: cb });
  }, []);

  /** keep state login separate */
  function reducer(state: State<T>, action: Action<T>): State<T> {
    const resetState = { data: {}, errors: {} } as typeof state;

    if (action.type === "reset") {
      // handle reset
      for (const k in state.data) {
        //@ts-ignore : ts is yelling at the type of `k`;
        resetState.data[k] = "";
      }
      resetState["errors"] = {} as T;
    }
    // in case the user provides a callback to reset `data` in more custom way,
    // then invert the control.
    if (action.type === "reset" && action.payload instanceof Function) {
      resetState.data = action.payload(resetState.data);
    }

    return (
      {
        data: {
          ...state,
          data: { ...state.data, ...action.payload },
        },
        errors: { ...state, errors: { ...state.errors, ...action.payload } },
        reset: resetState,
      }[action.type] ?? state
    );
  }
  
  return { formState, onSubmit, register, reset, dispatch };
}
