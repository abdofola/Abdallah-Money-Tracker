import { E } from "@app/services/api";
import { OneLiner } from "@components/OneLiner";
import { SEO } from "@components/SEO";
import { Spinner } from "@components/ui";
import { useAdminMutation } from "@services";
import { useRouter } from "next/router";
import React from "react";

type FormData = { email: string };
export default function AdminPanel() {
  const router = useRouter();
  const [logAdmin, { isLoading, error, reset }] = useAdminMutation();

  return (
    <div className="flex w-full h-full bg-gradient-to-tr from-pink-100 to-sky-200">
      <SEO title="admin-panel" meta={{ name: "", content: "" }} />

      <div className="p-1 w-full max-w-md m-auto">
        <h1 className="text-xl">Enter as admin</h1>
        <OneLiner
          reset={reset}
          apiError={(error as E)?.originalError}
          onSubmit={(formdata: FormData) => {
            logAdmin(formdata)
              .unwrap()
              .then((_payload) => {
                router.push("/signup");
              })
              .catch((err) => console.log({ err }));
          }}
          SubmitButton={
            <button className="grid place-items-center ml-auto w-24 h-10 capitalize shadow-3D rounded-lg">
              {isLoading ? <Spinner /> : "submit"}
            </button>
          }
        />
      </div>
    </div>
  );
}
