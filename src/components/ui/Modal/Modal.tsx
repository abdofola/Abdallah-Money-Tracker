import React from "react";
import { createPortal } from "react-dom";
import { Spinner } from "@components/ui";
import styles from "./modal.module.css";

type ModalProps = {
  children: React.ReactNode;
  close: () => void;
  className?: string;
  onConfirm: () => void;
  headerTxt: String;
  confirmationStatus: { isLoading: boolean; [k: string]: boolean };
};

export default function Modal({
  children,
  headerTxt,
  close,
  onConfirm,
  confirmationStatus: status,
  className,
}: ModalProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const child = (
    <div className={styles.overlay} onClick={close}>
      <div
        role="dialog"
        ref={ref}
        tabIndex={-1}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          <h4>{headerTxt ?? "dailog"}</h4>
        </header>
        <main className={styles.body}>{children}</main>
        <footer className={styles.footer}>
          <button name="cancel" type="button" onClick={close}>
            cancel
          </button>
          <button name="confirm" type="button" onClick={onConfirm}>
            {status.isLoading ? (
              <Spinner variants={{ intent: "secondary", width: "xs" }} />
            ) : (
              "Delete"
            )}
          </button>
        </footer>
      </div>
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
