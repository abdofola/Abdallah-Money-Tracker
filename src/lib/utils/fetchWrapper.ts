import { enviroment } from "../enviroment";

export function client<T = any, K = Error>(
  endpoint: string,
  { body, ...customConfig }: RequestInit | undefined = {}
) {
  const headers = { "Content-Type": "application/json" };
  const config: RequestInit | undefined = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) config.body = JSON.stringify(body);

  return fetch(enviroment[process.env.NODE_ENV] + endpoint, config).then(
    async (response) => {
      let data: T | null = null,
        error: K | null = null,
        errTxt: string;
      if (response.ok) data = await response.json();
      else {
        errTxt = await response.text();
        error = await Promise.reject(new Error(errTxt));
      }

      return { data, error };
    }
  );
}
