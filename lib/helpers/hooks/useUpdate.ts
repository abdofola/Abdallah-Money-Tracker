import { tryCatch, client } from "@lib/utils";
import { useState } from "react";

type Keys = "id" | "name" | "type" | "amount" | "createdAt" | "updataedAt";
type Result = { [key in Keys]: any };
export function useUpdate(url: string) {
  const [res, setResponse] = useState<Result | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setErr] = useState<null | unknown>(null);
  const stoploading = () => setLoading(false);
  const handler = async (customConfig: { body: any }) => {
    const config = {
      method: "PATCH",
      ...customConfig,
    };
    tryCatch(
      async () => {
        setLoading(true);
        const result = await client(url, config);
        setResponse(result.data);
      },
      (err) => {
        console.log({ err });
        setErr(err);
      },
      stoploading
    );
  };

  return [res, isLoading, error, handler] as const;
}
