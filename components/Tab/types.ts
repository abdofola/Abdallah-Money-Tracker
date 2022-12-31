import React, { SetStateAction } from "react";

type TypeItemsContext = {
  setItems: React.Dispatch<SetStateAction<Map<number, HTMLButtonElement>>>;
};
type RenderTabParam = {
  tab: { id: number; txt: string };
  isSelected: boolean;
};
type Props = {
  Group: React.ComponentType<TabGroupProps>;
  List: React.ComponentType<TabItemsProps>;
  Panels: React.ComponentType<{ children: React.ReactNode }>;
  Panel: React.ComponentType<{ children: React.ReactNode }>;
};
type TabGroupProps = {
  children: React.ReactNode;
  defaultTab?: number;
  className?: string;
  onChange?: React.Dispatch<SetStateAction<number>>;
};
type TabItemsProps = {
  tabs: RenderTabParam["tab"][];
  renderTab: (props: RenderTabParam) => React.ReactNode;
  className?: string;
};
type TabProps = {
  tab: RenderTabParam["tab"];
  className?: string;
  periodRef?: React.MutableRefObject<HTMLButtonElement>;
};

type TypeTabContext = {
  selectedIdx: number;
  setSelected: TabGroupProps["onChange"];
  onChange: TabGroupProps["onChange"];
};

export type {
  TabGroupProps,
  Props,
  TabItemsProps,
  TypeTabContext,
  TabProps,
  TypeItemsContext,
};
