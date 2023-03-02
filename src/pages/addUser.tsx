import React from "react";
import { NextPageWithLayout } from "./_app";
import { useAppDispatch } from "@app/hooks";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
import { useRouter } from "next/router";
import { enviroment } from "@lib/enviroment";
import { useAsync } from "@lib/helpers/hooks";
import { Form, Spinner } from "@components/ui";
import { Icon } from "@components/icons";

//TODO: this is should be a protected route `adduser`, and only admin user can add new users.
//COMPONENT
const Signup: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState("");
  const [execute, { status }] = useAsync<{ message: string; success: boolean }>(
    enviroment[process.env.NODE_ENV] + "/api/signup"
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e) => setEmail(e.target.value);
  const handleSubmit = async (formData) => {
    e.preventDefault();
    try {
      const { message } = await execute({
        body: formData,
      });
      console.log({ message });
      // dispatch(setCredentials(user));
      // console.log("payload", user);
      // router.push("/");
    } catch (error) {
      console.log({ error });
    }
  };

  //TODO: after adding login as an admin, another form should appear to enter new user credentials

  return (
    <>
      <h1 className="text-xl">Login as an admin</h1>
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
            value={email}
            onChange={handleChange}
          />
          <button className="flex justify-start items-center border border-gray-700 capitalize ml-auto px-6 py-1 rounded-md">
            {status === "pending" ? <Spinner /> : "login"}
          </button>
        </div>
      </Form>
    </>
  );
};

// page layout
Signup.Layout = (page) => {
  return (
    <Layout
      title="signup"
      className="flex flex-col items-center justify-center min-h-screen p-2"
    >
      {page}
    </Layout>
  );
};

Signup.Layout.displayName = "Signup";

export default Signup;
