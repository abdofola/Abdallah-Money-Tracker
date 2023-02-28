import React from "react";
import {
  Props,
  TabGroupProps,
  TabItemsProps,
  TabProps,
  TypeTabContext,
  TypeItemsContext,
  PanelsProps,
} from "./types";

const TabContext = React.createContext<TypeTabContext | null>(null);
const ItemsContext = React.createContext<TypeItemsContext | null>(null);

const useTab = () => {
  const tabContext = React.useContext(TabContext);
  if (!tabContext)
    throw new Error("tabContext must be used within Tab.Group Component");
  return tabContext;
};

const TabProvider: React.FC<TabGroupProps> = ({
  children,
  defaultTab,
  className,
  onChange,
}) => {
  const [selectedIdx, setSelected] = React.useState(defaultTab ?? 0);

  // console.log(children.props.tabs)
  return (
    <TabContext.Provider value={{ selectedIdx, setSelected, onChange }}>
      <div className={className}>{children}</div>
    </TabContext.Provider>
  );
};

const List: React.FC<TabItemsProps> = ({ tabs, renderTab, className }) => {
  const [items, setItems] = React.useState<Map<number, HTMLButtonElement>>(
    new Map()
    );
    const { selectedIdx } = useTab();
    const elem = items.get(selectedIdx);
    const [width, setWidth] = React.useState(elem?.clientWidth);
    const [offsetLeft, setOffset] = React.useState(elem?.offsetLeft);

  //when the element `offset` or `clientWidth` changes, update the state.
  if (elem && elem.offsetLeft !== offsetLeft) {
    setWidth(elem.clientWidth);
    setOffset(elem.offsetLeft)
  }  

  return (
    <ItemsContext.Provider value={{ setItems }}>
      <div className={className?.concat(" ", "relative")}>
        {tabs.map((tab) =>
          renderTab({ tab, isSelected: tab.id === selectedIdx })
        )}
        <span
          className="transition-all absolute bottom-0 h-[2px] bg-gray-600"
          style={{
            width: width + "px",
            left: offsetLeft + "px",
          }}
        />
      </div>
    </ItemsContext.Provider>
  );
};

const Tab: React.FC<TabProps> & Props = ({ className, tab, cb }) => {
  const { setSelected, onChange } = useTab();
  const { setItems } = React.useContext(ItemsContext) as TypeItemsContext;
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelected?.(Number(e.currentTarget.dataset["id"]));
    onChange?.(Number(e.currentTarget.dataset["id"]));
    cb?.();
  };

  return (
    <button
      data-id={tab.id.toString()}
      className={className}
      ref={(node) => {
        if (!node) return;

        setItems((prevState) => {
          const map = new Map(prevState);
          if (prevState.has(tab.id)) return prevState;

          map.set(tab.id, node);
          return map;
        });
      }}
      type="button"
      onClick={handleClick}
    >
      {tab.txt}
    </button>
  );
};

const Panels: React.FC<PanelsProps> = ({ children, className }) => {
  let id = 0;
  const renderedChildren = React.Children.toArray(children).map((child) => {
    let cloned;

    if (child.type.displayName === "Panel") {
      // if the child is `Panel` component; clone the element and add `id`prop.
      cloned = React.cloneElement(child, { id: id++ });
      return cloned;
    }
    return child;
  });

  return <div className={className}>{renderedChildren}</div>;
};

const Panel: React.FC<{
  children: React.ReactNode;
  className: string;
  id: number;
}> = ({ children, className, id }) => {
  const { selectedIdx } = useTab();
  if (id !== selectedIdx) return <></>;
  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  );
};

Panel.displayName = "Panel";

Tab.Group = TabProvider;
Tab.List = List;
Tab.Panels = Panels;
Tab.Panel = Panel;

export default Tab;
