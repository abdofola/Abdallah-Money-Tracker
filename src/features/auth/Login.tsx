import React from "react";
import { OneLiner } from "@components/OneLiner";
import { Icon } from "@components/icons";
import { Spinner } from "@components/ui";
import { useLoginMutation } from "@services";
import { useRouter } from "next/router";
import type { E } from "@app/services/api";

export default function Login() {
  const router = useRouter();

  const [login, { isLoading, isError, isSuccess, error, reset }] =
    useLoginMutation();

  return (
    <OneLiner
      apiError={isError ? (error as E).originalError : undefined}
      onSubmit={async (formdata) => {
        if (isSuccess) return;

        login({
          email: formdata.email,
          last_login: new Date(),
        })
          .unwrap()
          .then((payload) => {
            // console.log({ payload });
            router.push("/");
          })
          .catch((err) => {
            console.error({ err });
          });
      }}
      reset={reset}
      SubmitButton={
        <button className="transition grid place-items-center ml-auto w-24 h-10 capitalize shadow-3D rounded-lg ring-offset-2 ring-slate-200 focus:outline-0 focus:ring">
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
  );
}
