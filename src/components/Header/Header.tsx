import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {  Home } from "@components/icons";
import styles from "./Header.module.css";

const getLinks = (props) => ({
  home: { path: "/", Icon: <Home {...props} /> },
});

export default function Header() {
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
    <nav className={styles.nav}>
      <ul className={styles.list}>{renderedLink}</ul>
    </nav>
  );
}
