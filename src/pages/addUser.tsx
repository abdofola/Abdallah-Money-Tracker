import React from "react";
import { NextPageWithLayout } from "./_app";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
import { loginOrAddUser } from "@components/HOC";

const AddminLogin = loginOrAddUser({
  api: "login",
  handler({ payload }) {
    console.log({ payload });
  },
});
const AddUserForm = loginOrAddUser({
  api: "addUser",
  handler({ payload, router, dispatch }) {
    dispatch(setCredentials(payload));
    router.push("/");
  },
});

// page component
const AddUser: NextPageWithLayout = () => {
  const [isSuccess, setIsSuccess] = React.useState(false);

  return (
    <>
      <h1 className="text-xl">
        {isSuccess ? "Add User" : "Login as an admin"}
      </h1>
      {isSuccess ? (
        <AddUserForm />
      ) : (
        <AddminLogin isAdmin setIsSuccess={setIsSuccess} />
      )}
    </>
  );
};

// page layout
AddUser.Layout = function getLayout(page) {
  return (
    <Layout
      title="adduser"
      className="flex flex-col items-center justify-center min-h-screen p-2"
    >
      {page}
    </Layout>
  );
};

export default AddUser;
