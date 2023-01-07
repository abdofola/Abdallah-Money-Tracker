import { Finance } from "@prisma/client";
import React from "react";
import { client } from "@lib/helpers";
import { tryCatch } from "@lib/utils";

export function useRead(url: string) {
  const [data, setData] = React.useState<null | Finance[]>(null);
  const [err, setErr] = React.useState<null | unknown>(null);
  const [loading, setLoading] = React.useState(false);
  const stopLoading = () => setLoading(false);

  React.useEffect(() => {
    let ignore = false;
    const read = (url: string) => {
      tryCatch(
        async () => {
          setLoading(true);
          const finances = await client(url);
          !ignore && setData(finances);
        },
        (err) => {
          setErr(err);
        },
        stopLoading
      );
    };
    read(url);

    // cleanup
    return () => {
      ignore = false;
    };
  }, [url]);

  return { data, err, loading };
}
