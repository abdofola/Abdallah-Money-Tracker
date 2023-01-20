import { Layout } from "@components/Layout";
import React from "react";
import { NextPageWithLayout } from "./_app";

//COMPONENT
const Login: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState("");
  const handleChange = (e) => setEmail(e.target.value);
  const handleSubmit = (e) => {
    //TODO: make mutation request
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={email} onChange={handleChange} />
    </form>
  );
};

// page layout
// eslint-disable-next-line react/display-name
Login.Layout = (page) => {
  return <Layout title="login">{page}</Layout>;
};
