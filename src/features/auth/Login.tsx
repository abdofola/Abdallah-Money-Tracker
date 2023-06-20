import React from "react";
import { OneLiner } from "@components/OneLiner";
import { Icon } from "@components/icons";
import { Spinner } from "@components/ui";
import { useLoginMutation } from "@services";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();

  const [login, { isLoading, isError, isSuccess, error }] = useLoginMutation();

  console.log({ isSuccess, isError });

  // TODO: display error message
  return (
    <div className="relative">
      <OneLiner
        onSubmit={async (formdata: { email: string }) => {
          if (isSuccess) return;

          login({
            email: formdata.email,
            last_login: new Date(),
          })
            .unwrap()
            .then((payload) => {
              console.log({ payload });
              router.push("/");
            })
            .catch((err) => console.error({ err }));
        }}
        SubmitButton={
          <button className="grid place-items-center ml-auto w-24 h-10 capitalize shadow-3D rounded-lg">
            {isSuccess ? (
              <Icon href="/sprite.svg#thumbs-up" className=" w-5 h-5 " />
            ) : isLoading ? (
              <Spinner />
            ) : (
              "login"
            )}
          </button>
        }
      />
    </div>
  );
}
