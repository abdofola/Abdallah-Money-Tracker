import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { setCredentials, Login } from "@features/auth";
import { Icon } from "@components/icons";
import { loginOrAddUser } from "@components/HOC";

const UserLogin = loginOrAddUser({
  api: "login",
  handler({ payload, router, dispatch }) {
    dispatch(setCredentials(payload));
    router.push("/");
  },
});

//COMPONENT
const LoginPage: NextPageWithLayout = () => {
  return (
    <div className="max-w-full max-h-full">
      <div className="flex flex-col items-center gap-4 -translate-y-6">
        <span>
          <Icon href="/sprite.svg#logo" />
        </span>
        <h1 className="text-xl text-center tracking-wider font-semibold capitalize sm:text-3xl">
          Welcome to money flow application
        </h1>
      </div>
      <Login />
    </div>
  );
};

// page layout
LoginPage.Layout = function getLayout(page) {
  return (
    <Layout
      title="login"
      className="grid grid-cols-1 place-items-center w-full h-full p-1 bg-gradient-to-tr from-pink-100 to-sky-200"
    >
      {page}
    </Layout>
  );
};

export default LoginPage;
