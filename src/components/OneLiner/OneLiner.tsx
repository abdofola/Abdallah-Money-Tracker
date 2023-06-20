import React from "react";
import { Form } from "@components/ui";
import { Icon } from "@components/icons";
import { FormProps } from "@components/ui/Form";

type OneLinerProps = {
  SubmitButton: JSX.Element;
  /** Called on `form` submission, and recieves the `form` data in a key, value pair */
  onSubmit: (input:any) => void;
};

export default function OneLiner({ SubmitButton, onSubmit }: OneLinerProps) {
  const handleSubmit: FormProps['onSubmit'] = (formData) =>{
    onSubmit(formData);
  }
  
  return (
    <Form onSubmit={handleSubmit} variants={{ width: "lg" }}>
      <div className="flex items-center gap-2">
        <label htmlFor="email">
          <Icon href="/sprite.svg#mail" className="w-5 h-5 fill-gray-400" />
        </label>
        <input
          required
          className="basis-auto grow shrink bg-transparent ring-offset-4 focus:outline-none"
          id="email"
          type="email"
          name="email"
          placeholder="someone@example.com"
        />
        {SubmitButton}
      </div>
    </Form>
  );
}
