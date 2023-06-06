import React from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import styles from "./modal.module.css";
import Form from "../Form";
import { Transition } from "@components/Transition";

type ModalProps = {
  children: React.ReactNode;
  close: () => void;
  headerTxt: String;
  confirmationButton: React.ReactElement;
  onConfirm?: (data: { [k: string]: any; categoryId?: string }) => void;
  className?: string;
  isMounted: boolean;
} & { [k in "to" | "from"]?: string };

export default function Modal({
  children,
  headerTxt,
  confirmationButton,
  close,
  onConfirm = () => {},
  isMounted,
  className = "",
  ...rest
}: ModalProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;
  const child = (
    <div className={styles.overlay.concat(" ", className)} onClick={close}>
      <Transition
        isMounted={isMounted}
        from="opacity-0 translate-y-full sm:translate-y-0 sm:scale-0"
        to="opacity-100 translate-y-0 sm:scale-100"
        {...rest}
      >
        <div
          role="dialog"
          ref={ref}
          tabIndex={-1}
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <Form
            id="dialog"
            className="border-none"
            variants={{ padding: "0", margin: "0", gutter: "0" }}
            onSubmit={onConfirm}
          >
            <header className={styles.header}>
              <h4>{headerTxt ?? "dailog"}</h4>
            </header>
            <article className={styles.body}>{children}</article>
            <footer>
              <menu className={styles.footer}>
                <button name="cancel" type="button" onClick={close}>
                  {translation.buttons.cancel}
                </button>
                {confirmationButton}
              </menu>
            </footer>
          </Form>
        </div>
      </Transition>
    </div>
  );

  React.useEffect(() => {
    const body = document.body;
    const windowScrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.right = "0";
    body.style.left = "0";
    body.style.top = `-${windowScrollY}px`;

    ref.current?.focus();

    //cleanup
    return () => {
      // When the modal is hidden, we want to remain at the top of the scroll position
      body.style.position = "";
      body.style.top = "";
      window.scrollTo(0, windowScrollY);
    };
  }, []);

  return createPortal(child, document.body);
}

{
  /* <dialog className={styles.dialog}>
      <Form
        id="dialog"
        method="dialog"
        onSubmit={(data) => console.log({ data })}
      >
        <header className={styles.header}>
          <h4>{headerTxt ?? "dailog"}</h4>
        </header>
        <article>{children}</article>
        <footer>
          <menu>
            <button form="dialog" name="confirm" value="confirm">
              confirm
            </button>
            <button name="cancel" value="cancel">cancel</button>
          </menu>
        </footer>
      </Form>
    </dialog> */
}
