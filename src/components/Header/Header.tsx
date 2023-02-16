import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Document } from "@components/icons";
import { useAuth } from "@lib/helpers/hooks";
import styles from "./Header.module.css";

const getLinks = (props) => ({
  home: { path: "/", Icon: <Home {...props} /> },
  statement: { path: "/transactions", Icon: <Document {...props} /> },
});

// the user comes from cookie instead of state
// because when refreshing a page, the state gets destroyed
export default function Header({user}) {
  // const { user } = useAuth();
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;
  const renderedListItems = Object.entries(getLinks({})).map(
    ([label, { path, Icon }]) => (
      <li key={label} className={styles.item}>
        <Link href={path}>
          <a className={styles.pageLink} data-active={isActive(path)}>
            <span className="icon">{Icon}</span>
            <span className="iconText">{label}</span>
          </a>
        </Link>
      </li>
    )
  );

  return (
    <nav id="nav" className={styles.nav}>
      <ul className={styles.list}>
        {renderedListItems}
        <li
          id="navLogin"
          className="fixed flex bg-white border-b top-0 left-0 right-0 p-2 sm:static sm:border-none sm:p-0 sm:inline sm:ml-auto"
        >
          <Link href={user ? "/api/logout" : "/login"}>
            <a className="ml-auto px-2 py-px text-gray-500 bg-gray-50 rounded-sm">
              {user ? "logout" : "login"}{" "}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
