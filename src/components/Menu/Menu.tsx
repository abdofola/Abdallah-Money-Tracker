import { Transition } from "@components/Transition";
import React from "react";

type TContext = [
  isOpen: boolean,
  setIsopen: React.Dispatch<React.SetStateAction<boolean>>
];

const MenuContext = React.createContext<TContext | null>(null);

export default function Menu({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <MenuContext.Provider value={[isOpen, setIsOpen]}>
      {children}
    </MenuContext.Provider>
  );
}

function MenuButton() {
  const [isOpen, setIsOpen] = React.useContext(MenuContext) as TContext;

  // maintain screen scroll position, and prevent body from scrolling.
  React.useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const windowScrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.right = "0";
    body.style.left = "0";
    body.style.top = `-${windowScrollY}px`;

    // ref.current?.focus();

    //cleanup
    return () => {
      // When the modal is hidden, we want to remain at the top of the scroll position
      body.style.position = "";
      body.style.top = "";
      window.scrollTo(0, windowScrollY);
    };
  }, [isOpen]);

  return (
    <button
      className={`fixed top-5 z-50 flex flex-col justify-between w-5 h-4
        before:w-full before:h-[2px] 
        after:w-3/4 after:h-[2px]
        ${
          isOpen
            ? "justify-self-end w-8 inset-0 my-auto ltr:ml-auto ltr:mr-8 rtl:mr-auto rtl:ml-8 before:rotate-45 before:bg-white after:absolute after:inset-0 after:-translate-y-1/2 after:ltr:-translate-x-2 after:rtl:translate-x-2 after:w-12 after:h-12 after:rounded-full after:border"
            : "justify-self-start before:bg-gray-500 after:bg-gray-500"
        }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span
        className={`relative w-full h-[2px] 
        ${
          isOpen
            ? "-rotate-45 translate-y-[-14px] -translate-x-px bg-white"
            : "bg-gray-500 before:absolute before:w-10 before:h-10 before:-translate-y-1/2 before:rtl:translate-x-5 before:ltr:-translate-x-5 before:border before:rounded-full before:bg-gray-50 before:z-[-1]"
        }`}
      />
    </button>
  );
}

function MenuScreen({ children }) {
  //TODO:
  //4- menu screen should include
  // a- user avatar alongside the name
  // b- logout button
  const [isOpen, setIsOpen] = React.useContext(MenuContext) as TContext;

  return (
    <Transition
      isMounted={isOpen}
      as="section"
      className="fixed inset-0 z-40 bg-gray-700 bg-opacity-70"
      onClick={() => setIsOpen(false)}
    >
      <Transition
        isMounted={isOpen}
        from="opacity-0 ltr:-translate-x-full rtl:translate-x-full"
        to="opacity-100 translate-x-0"
        className="w-3/4 h-full bg-white drop-shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </Transition>
    </Transition>
  );
}

Menu.Button = MenuButton;
Menu.Screen = MenuScreen;
