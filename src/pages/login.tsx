import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
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
const Login: NextPageWithLayout = () => {
  return (
    <div className="space-y-2 basis-1/3">
      <div className="flex flex-col items-center gap-4 -translate-y-6">
        <span className="">
          <Icon href="/sprite.svg#logo" />
        </span>
        <h1 className="text-md font-semibold capitalize">
          Welcome to money flow application
        </h1>
      </div>
      <UserLogin />
    </div>
  );
};

// page layout
Login.Layout = function getLayout(page) {
  return (
    <Layout
      title="login"
      className="flex justify-center items-center min-w-screen min-h-screen bg-gradient-to-tr from-pink-100 to-blue-200"
    >
      {page}
    </Layout>
  );
};

export default Login;
