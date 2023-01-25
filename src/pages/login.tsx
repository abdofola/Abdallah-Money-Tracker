import React from "react";
import { NextPageWithLayout } from "./_app";
import { useAppDispatch } from "@app/hooks";
import { Layout } from "@components/Layout";
import { setCredentials } from "@features/auth";
import { useRouter } from "next/router";
import { FetchError, fetchJson } from "@lib/utils";

//COMPONENT
const Login: NextPageWithLayout = () => {
  const [email, setEmail] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleChange = (e) => {
    setError("");
    setEmail(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await fetchJson("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      dispatch(setCredentials(data.user));
      console.log("payload", data);
      router.push("/");
    } catch (error) {
      if (error instanceof FetchError) {
        const { message } = error.data;
        console.log({ error });
        setError(message);
      } else {
        //error other than `FetchError`
        setError("unexpected error, please try again!");
      }
    } finally {
      setIsLoading(false);
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
      <button disabled={isLoading}>{isLoading ? "loading" : "login"}</button>
      {error && <p>{error}</p>}
    </form>
  );
};

// page layout
Login.Layout = (page) => {
  return <Layout title="login">{page}</Layout>;
};

Login.Layout.displayName = "Login";

export default Login;
