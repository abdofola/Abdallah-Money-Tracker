import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Document, Icon } from "@components/icons";
// import { useAuth } from "@lib/helpers/hooks";
import { en, ar } from "@locales";
import styles from "./Header.module.css";

const pages = {
  home: { path: "/", Icon: <Home /> },
  statement: { path: "/transactions", Icon: <Document /> },
};

// the user comes from cookie instead of state
// because when refreshing a page, the state gets destroyed
export default function Header({ user }) {
  const router = useRouter();
  const { locale, pathname, query, asPath } = router;
  const translation = locale === "en" ? en : ar;
  const renderedListItems = Object.entries(pages).map(
    ([label, { path, Icon }]) => (
      <li key={label} className={styles.item}>
        <Link href={path} shallow>
          <a className={styles.pageLink} data-active={isActive(path)}>
            <span>{Icon}</span>
            <span>{translation.nav[label]}</span>
          </a>
        </Link>
      </li>
    )
  );
  function isActive(path: string) {
    return pathname === path;
  }

  // setting `dir` and `lang` of the document in accordance to `locale`
  React.useEffect(() => {
    const dir = locale === "en" ? "ltr" : "rtl";
    // set `html` direction whenever locale changes.
    window.document.documentElement.dir = dir;
    window.document.documentElement.lang = locale!;
  }, [locale]);

  return (
    <nav id="nav" className={styles.nav}>
      {/*  logo  */}
      <Link href="/" shallow>
        <a className="fixed ltr:top-2 rtl:top-1 z-10 sm:static">
          <Icon href="/sprite.svg#logo" className="w-7 h-7 sm:w-10 sm:h-10" />
        </a>
      </Link>
      {/* pages' links */}
      <ul className={styles.list}>
        {renderedListItems}
        {/* login/logout */}
        <li
          id="navLogin"
          className="fixed flex gap-4 justify-end bg-white border-b top-0 left-0 right-0 p-2 sm:static sm:border-none sm:p-0"
        >
          <select
            name="locale"
            defaultValue={locale}
            onChange={async (e) => {
              router.push({ pathname, query }, asPath, {
                locale: e.target.value,
                shallow: true,
              });
            }}
          >
            <option value="en">en</option>
            <option value="ar">ar</option>
          </select>

          <Link href={user ? "/api/logout" : "/login"}>
            <a className="px-2 py-px rtl:text-sm text-gray-500 bg-gray-50 rounded-sm">
              {user ? translation.nav["logout"] : translation.nav["login"]}
            </a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
