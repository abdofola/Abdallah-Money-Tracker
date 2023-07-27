import { Transition } from "@components/Transition";
import React from "react";

type TContext = [
  isOpen: boolean,
  setIsopen: React.Dispatch<React.SetStateAction<boolean>>
];
type MScreenProps = { children: React.ReactNode; className?: string };

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
  const [isOpen, setIsOpen] = React.useContext(MenuContext)!;

  // maintain screen scroll position, and prevent body from scrolling.
  React.useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    const windowScrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.right = "0";
    body.style.left = "0";
    body.style.top = `-${windowScrollY}px`;

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
      className={` flex flex-col justify-between w-5 h-4
        before:w-full before:h-[2px] 
        after:w-3/4 after:h-[2px]
        ${
          isOpen
            ? "fixed z-50 justify-self-end w-8 inset-0 my-auto ltr:ml-auto ltr:mr-8 rtl:mr-auto rtl:ml-8 before:rotate-45 before:bg-white"
            : "justify-self-start before:bg-gray-500 after:bg-gray-500"
        }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span
        className={`relative w-full h-[2px] 
        before:absolute before:w-10 before:h-10  
        before:-translate-y-1/2 before:rtl:translate-x-5 before:ltr:-translate-x-5
        before:border before:rounded-full 
        ${
          isOpen
            ? "-rotate-45 -translate-y-2 bg-white"
            : "bg-gray-500 before:bg-white before:z-[-1]"
        }`}
      />
    </button>
  );
}

function MenuScreen({ children, className }: MScreenProps) {
  //TODO:
  //4- menu screen should include
  // a- user avatar alongside the name
  // b- logout button
  const [isOpen, setIsOpen] = React.useContext(MenuContext)!;

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
        className={className}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        delay={100}
      >
        {children}
      </Transition>
    </Transition>
  );
}

Menu.Button = MenuButton;
Menu.Screen = MenuScreen;
