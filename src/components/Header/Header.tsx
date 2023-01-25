import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home } from "@components/icons";
import styles from "./Header.module.css";
import { useAuth } from "@lib/helpers/hooks";

const getLinks = (props) => ({
  home: { path: "/", Icon: <Home {...props} /> },
});

export default function Header() {
  const {user} = useAuth();
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;
  const renderedLink = Object.entries(getLinks({})).map(
    ([label, { path, Icon }]) => (
      <li key={label} className={styles.item}>
        <Link href={path}>
          <a className={styles.pageLink} data-active={isActive(path)}>
            {Icon}
            <span>{label}</span>
          </a>
        </Link>
      </li>
    )
  );
  return (
    <nav id="nav" className={styles.nav}>
      <div
        id="navLogin"
        className="fixed inline-flex top-0 right-0 left-0 p-2 items-center justify-end bg-white border border-gray-100"
      >
        <Link href={user ? "/api/logout" : "/login"}>
          <a className="px-2 py-px text-gray-500 bg-gray-100 rounded-sm">
            {user ? "logout" : "login"}{" "}
          </a>
        </Link>
      </div>
      <div>

      <ul className={styles.list}>{renderedLink}</ul>
      </div>
    </nav>
  );
}
