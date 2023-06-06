import React from "react";
import { useRouter } from "next/router";
import { ar, en } from "@locales";

export default function Welcoming() {
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;

  return (
    <article className="my-auto p-4">
      <h1 className="mb-6 text-3xl capitalize font-semibold leading-normal sm:text-4xl">
        {translation.welcoming.header}
      </h1>
      <p className="text-lg text-gray-600 text-justify sm:text-2xl">{translation.welcoming.p}</p>
    </article>
  );
}
