import React from "react";
import { Form, Spinner } from "@components/ui";
import { Icon } from "@components/icons";
import { useRouter, NextRouter } from "next/router";
import { useAppDispatch } from "@app/hooks";
import { useAsync } from "@lib/helpers/hooks";
import { enviroment } from "@lib/enviroment";

//TODO: it shouldn't be HOC component, this just isn't the right usage!

type Props = {
  isAdmin?: Boolean;
  setIsSuccess?: React.Dispatch<React.SetStateAction<boolean>>;
};

function loginOrAddUser<P = Props>({
  api,
  handler,
}: {
  api: "login" | "addUser";
  handler: ({
    payload,
    router,
    dispatch,
  }: {
    payload: any;
    router: NextRouter;
    dispatch: ReturnType<typeof useAppDispatch>;
  }) => void;
}): React.FC<P> {
  return function Wrapper(props) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [execute, { status, error }] = useAsync(
      `${enviroment[process.env.NODE_ENV]}/api/${api}`
    );

    function handleSubmit(formData) {
      execute({
        body: { ...formData, isAdmin: props.isAdmin },
      })
        .then((payload) => {
          props.setIsSuccess?.(true);
          handler({ payload, router, dispatch });
        })
        .catch((error) => console.log({ error }));
    }

    return (
      <div>
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
            <button className="grid place-items-center ml-auto w-24 h-10 capitalize shadow-3D rounded-lg">
              {status === "pending" ? <Spinner /> : "login"}
            </button>
          </div>
        </Form>
        {status === "error" && <p>{error}</p>}
      </div>
    );
  };
}

export default loginOrAddUser;
