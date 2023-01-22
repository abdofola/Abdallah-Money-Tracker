import React from "react";
import { NextPageWithLayout } from "./_app";
import { useAppDispatch } from "@app/hooks";
import { useAddUserMutation } from "@app/services/api";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
import { useRouter } from "next/router";
//COMPONENT
const Signup: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState("");
  const [addUser] = useAddUserMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e) => setEmail(e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await addUser({ email }).unwrap();
      console.log({ user });
      dispatch(setCredentials(user));
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
// eslint-disable-next-line react/display-name
Signup.Layout = (page) => {
  return <Layout title="signup">{page}</Layout>;
};

export default Signup;
