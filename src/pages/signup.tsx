import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { withSessionSsr } from "@lib/session";
import { Role } from "@prisma/client";
import { Form, Spinner } from "@components/ui";
import { useSignupMutation } from "@services";
import { Transition } from "@components/Transition";
import { E } from "@app/services/api";
import { useForm } from "@lib/helpers/hooks";

type FormData = {
  email: string;
  name?: string;
  role: Role;
};
export const getServerSideProps = withSessionSsr(async ({ req }) => {
  const { user } = req.session;

  // redirect to loginPage.
  if (!user)
    return { redirect: { permanent: false, destination: "/admin-panel" } };

  return { props: {} };
});

// page component
const SignupPage: NextPageWithLayout = () => {
  const { onSubmit, register } = useForm<FormData>();
  const [signup, { data, isLoading, isSuccess, error, isError }] =
    useSignupMutation();
  const submissionHandler = (formdata: FormData) => {
    signup(formdata);
  };

  return (
    <div className=" m-auto w-full max-w-md">
      <h1 className="text-lg font-semibold leading-loose tracking-widest capitalize">
        enter user credentials
      </h1>
      <Form
        noValidate
        className="relative"
        onSubmit={onSubmit(submissionHandler)}
        variants={{ gutter: 2, margin: 0, padding: 4 }}
      >
        <label htmlFor="name" className="flex capitalize">
          <span className="basis-1/4">name</span>
          <input
            className="basis-full py-1 px-4 shadow-inner bg-gray-50 rounded-md"
            {...register("name", { id: "name", type: "text" })}
          />
        </label>
        <label htmlFor="email" className="flex capitalize">
          <span className="basis-1/4">email</span>
          <input
            className="basis-full py-1 px-4 shadow-inner bg-gray-50 rounded-md"
            {...register("email", { type: "email", id: "email", required:true })}
          />
        </label>
        <label htmlFor="role" className="flex capitalize">
          <span className="basis-1/4">role</span>
          <select
            className="relative basis-full px-4 py-1 bg-gray-50 appearance-none "
            {...register("role", { id: "role"})}
          >
            <option value="USER">user</option>
            <option value="ADMIN">admin</option>
          </select>
        </label>
        <button className="grid place-items-center h-9 mt-2 shadow-3D rounded-lg">
          {isLoading ? <Spinner /> : "submit"}
        </button>
        <Transition
          isMounted={isError}
          as="span"
          className="text-red-500 font-medium"
          from="opacity-0 scale-0"
          to="opacity-100 scale-100"
        >
          {(error as E)?.originalError}
        </Transition>
        <Transition
          isMounted={isSuccess}
          as="span"
          className="text-green-500 font-medium"
          from="opacity-0 scale-0"
          to="opacity-100 scale-100"
        >
          {`User '${data?.signup.name}' has been add!`}
        </Transition>
      </Form>
    </div>
  );
};

// page layout
SignupPage.Layout = function getLayout(page) {
  return (
    <Layout
      title="signup"
      className="flex flex-col h-full p-2 bg-gradient-to-tr from-pink-100 to-sky-200"
    >
      {page}
    </Layout>
  );
};

export default SignupPage;
