// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next";
import type { IronSessionOptions } from "iron-session";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextApiHandler,
} from "next";
import { User } from "@prisma/client";

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: "money-management",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export function withSessionRoute(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions);
}

// Theses types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export function withSessionSsr<
  P extends { [key: string]: unknown } = { [key: string]: unknown }
>(
  handler: (
    context: GetServerSidePropsContext
  ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions);
}

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: User;
  }
}
