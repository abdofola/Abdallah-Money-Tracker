import { enviroment } from "../enviroment";

export const client = (
  endpoint: string,
  { body, ...customConfig }: RequestInit | undefined = {}
) => {
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

  return fetch(`${enviroment[process.env.NODE_ENV]}/${endpoint}`, config).then(
    async (response) => {
      let result, errTxt;
      if (response.ok) result = await response.json();
      else {
        errTxt = await response.text();
        result = Promise.reject(new Error(errTxt));
      }

      return result;
    }
  );
};
