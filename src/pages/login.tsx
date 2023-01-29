import React from "react";
import { NextPageWithLayout } from "./_app";
import { useAppDispatch } from "@app/hooks";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
import { useRouter } from "next/router";
import { Form, Spinner } from "@components/ui";
import { useAsync } from "@lib/helpers/hooks";
import { User } from "@prisma/client";
import { Icon } from "@components/icons";
import { enviroment } from "@lib/enviroment";

const URL = enviroment[process.env["NODE_ENV"]] + "/api/login";

//COMPONENT
const Login: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState("");
  const [execute, { error, status }] = useAsync(URL);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = (formData) => {
    execute({ body: formData })
      .then((data) => {
        // console.log({ data });
        dispatch(setCredentials(data.data));
        router.push("/");
      })
      .catch(() => {});
  };

  return (
    <div className="flex flex-col gap-6 mt-[15%] p-4">
      <p className="text-xl font-bold">
        What are the things that you spend most of your money on?
        <br /> How to balance my expenses against my income?
        <br /> Hummmm.. let's login and find out!
      </p>
      <Form onSubmit={handleSubmit} variants={{ margin: 0, padding: "2" }}>
        <div className="flex items-center gap-2">
          <label htmlFor="email">
            <Icon href="/sprite.svg#mail" className="w-5 h-5 fill-gray-400" />
          </label>
          <input
            required
            className="bg-transparent ring-offset-4 focus:outline-none"
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
      {status === "error" && <p>{error}</p>}
    </div>
  );
};

// page layout
Login.Layout = (page) => {
  return (
    <Layout
      title="login"
      className="flex justify-center h-screen bg-gradient-to-tr from-pink-100 to-blue-200"
    >
      {page}
    </Layout>
  );
};

Login.Layout.displayName = "Login";

export default Login;
