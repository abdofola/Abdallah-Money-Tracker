import React from "react";
import { NextPageWithLayout } from "./_app";
import { useAppDispatch } from "@app/hooks";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
import { useRouter } from "next/router";
import { fetchJson } from "@lib/utils";
import { enviroment } from "@lib/enviroment";

//TODO: this is should be a protected route `adduser`, and only admin user can add new users.
//COMPONENT
const Signup: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e) => setEmail(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await fetchJson(enviroment[process.env.NODE_ENV]+"/api/signup", {
        body: { email },
      });
      dispatch(setCredentials(user));
      console.log("payload", user);
      router.push("/");
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Enter your email <br />
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
        />
      </label>
      <button>signup</button>
    </form>
  );
};

// page layout
Signup.Layout = (page) => {
  return <Layout title="signup">{page}</Layout>;
};

Signup.Layout.displayName = "Signup";

export default Signup;
