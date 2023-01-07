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
import styled from "styled-components";

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
  const [items, setItems] = React.useState(new Map());
  const { selectedIdx } = useTab();

  return (
    <ItemsContext.Provider value={{ setItems }}>
      <Wrapper
        className={className}
        role="tablist"
        $selected={selectedIdx}
        $items={items}
      >
        {tabs.map((tab) =>
          renderTab({ tab, isSelected: tab.id === selectedIdx })
        )}
      </Wrapper>
    </ItemsContext.Provider>
  );
};

const Tab: React.FC<TabProps> & Props = ({
  className,
  tab,
  periodRef,
}) => {
  const { setSelected, onChange } = useTab();
  const { setItems } = React.useContext(ItemsContext) as TypeItemsContext;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setSelected?.(Number(e.currentTarget.dataset["id"]));
    onChange?.(Number(e.currentTarget.dataset["id"]));
    if (tab.txt === "period" && periodRef) periodRef.current.click();
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

const Panels: React.FC<PanelsProps> = ({
  children,
  className,
}) => {
  let id = 0;
  const renderedChildren = React.Children.toArray(children).map((child) => {
    let cloned;
    if (child.type.name === "Panel") {
      cloned = React.cloneElement(child, { id: id++ });
      return cloned;
    }
    return child;
  });

  return <div className={className}>{renderedChildren}</div>;
};

const Panel: React.FC<{ children: React.ReactNode }> = ({ children, id }) => {
  const { selectedIdx } = useTab();
  if (id !== selectedIdx) return;
  return <div role="tabpanel">{children}</div>;
};

const Wrapper = styled.div`
  position:relative;
  &::before {
  content: '';
  position:absolute;
  bottom:0;
  left:${({ $selected, $items }) => $items.get($selected)?.offsetLeft}px;
  width: ${({ $selected, $items }) => $items.get($selected)?.clientWidth}px;
  height: 2px;
  transition:left 0.15s linear;
`;

Tab.Group = TabProvider;
Tab.List = List;
Tab.Panels = Panels;
Tab.Panel = Panel;

export default Tab;
