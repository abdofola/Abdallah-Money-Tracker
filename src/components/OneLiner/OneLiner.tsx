import React from "react";
import { Form } from "@components/ui";
import { Icon } from "@components/icons";
import { useForm } from "@lib/helpers/hooks";
import { Transition } from "@components/Transition";

type OneLinerProps = {
  apiError: string | undefined;
  SubmitButton: JSX.Element;
  /** called on `form` submission, and recieves the `form` data */
  onSubmit(input: FormData): any;
  /** callback to reset rtk query state */
  reset?: () => void;
};
type FormData = {
  email: string;
};
export default function OneLiner({
  apiError,
  SubmitButton,
  onSubmit: handleSubmit,
  reset,
}: OneLinerProps) {
  const ref = React.useRef<HTMLInputElement | null>(null);
  const {
    formState: { errors, data },
    register,
    onSubmit,
    reset: resetForm,
  } = useForm<FormData>();

  // focus input when component first mount
  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  //console.log({ errors, data });

  return (
    <div className="relative">
      <Form
        noValidate
        onSubmit={onSubmit(async (data) => {
          await handleSubmit(data);
          resetForm();
        })}
        variants={{ width: "lg" }}
        className={` ${errors.email ? "ring-2 ring-red-600" : ""}`}
      >
        <div className="flex items-center gap-2">
          <label htmlFor="email">
            <Icon href="/sprite.svg#mail" className="w-5 h-5 fill-gray-400" />
          </label>
          <input
            ref={ref}
            className="basis-auto grow shrink bg-transparent focus:outline-none"
            {...register("email", {
              id: "email",
              type: "email",
              required: true,
              placeholder: "someone@example.com",
              onChange(_e) {
                //reset rtk query state
                if (apiError) {
                  reset?.();
                }
              },
            })}
          />
          {SubmitButton}
        </div>
      </Form>
      {/* client error */}
      <Transition
        isMounted={Boolean(errors.email)}
        className="absolute origin-bottom-left left-0 right-0 -bottom-4"
        from="scale-y-0"
        to=" scale-y-100"
      >
        <div className="absolute flex gap-1">
          <Icon
            href="/sprite.svg#exclamation-mark"
            className="w-6 h-6 fill-orange-300"
          />
          <span className="">{errors.email}</span>
        </div>
      </Transition>
      {/* server error */}
      <Transition
        isMounted={Boolean(apiError)}
        className="absolute origin-bottom-right left-0 right-0 -bottom-4"
        from="scale-y-0"
        to=" scale-y-100"
      >
        <div className="absolute flex gap-1">
          <Icon
            href="/sprite.svg#exclamation-mark"
            className="w-6 h-6 fill-red-500"
          />
          <span >{apiError}</span>
        </div>
      </Transition>
    </div>
  );
}
