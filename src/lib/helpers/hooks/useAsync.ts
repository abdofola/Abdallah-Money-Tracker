import { useCallback, useState, useEffect } from "react";
import { fetchJson, FetchError } from "@lib/utils";

//This hook inspired by https://usehooks.com/useAsync/


type Status = "idle" | "pending" | "success" | "error";

export function useAsync<T = unknown>( url:string, immediate = false ) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  // The execute function wraps fetchJson and
  // handles setting state for pending, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, and code can be optimized when needed.
  const execute = useCallback(
    async (init?: RequestInit | undefined) => {
      setStatus("pending");
      setError(null);
      // setData(null);

      try {
        const json = await fetchJson<T>(url, init);
        setStatus("success");
        setData(json);
        return json;
      } catch (error) {
        setStatus("error");
        if (error instanceof FetchError) {
          setError(error.data.message);
        } else {
          //error other than `FetchError`
          console.log({ error });
          setError("Oops something went wrong, please try again!");
        }
        throw error;
      }
    },
    [url]
  );
  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    let ignore = false;

    if (immediate && !ignore ) {
      execute();
    }

    return () => {ignore = true}
  }, [execute, immediate]);

  return [execute, { data, status, error }] as const;
}
