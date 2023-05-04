import React from "react";
import { Check, Icon, Plus } from "@components/icons";
import { CategoriesProps, CategoryProps } from "./types";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import { Transition } from "@components/Transition";

function CategoryList({
  categories,
  canAddCategory,
  selectedId,
  setSelectedId,
  renderCategory,
  open,
}: CategoriesProps) {
  const [selected, setSelected] = React.useState<string | null>(null);
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;
  const isControlled =
    selectedId !== undefined && setSelectedId instanceof Function;

  // console.log({selectedId, categories})
  return (
    <ul className="grid grid-cols-4 gap-4">
      {categories.map((cat) =>
        renderCategory({
          cat,
          isSelected: (isControlled ? selectedId : selected) === cat.id,
          icon: (
            <Icon
              className="w-10 h-10"
              href={`/${cat.type}/sprite.svg#${cat.iconId}`}
            />
          ),
          onClick: () => {
            isControlled ? setSelectedId(cat.id) : setSelected(cat.id);
          },
        })
      )}
      <Transition isMounted={canAddCategory!}>
        <button type="button" className="grid items-end" onClick={open}>
          <span className=" mx-auto bg-gray-200 rounded-full">
            <Plus className="w-8 h-8" />
          </span>
          <span className="text-sm">{translation.buttons.more}</span>
        </button>
      </Transition>
    </ul>
  );
}

export default function Category({
  cat,
  isSelected,
  icon,
  onClick,
}: CategoryProps) {
  const { locale } = useRouter();
  const { color, id, name } = cat;

  return (
    <li className="grid">
      <label
        htmlFor={id}
        onClick={onClick}
        className={`relative grid items-end -mx-2 rounded-md cursor-pointer ${
          isSelected ? "bg-gray-100 shadow-inner" : ""
        }`}
      >
        <span
          style={{
            borderBottom: `4px solid ${!isSelected ? color : "transparent"}`,
          }}
          className={`justify-self-center p-2 ${
            !isSelected ? `rounded-full` : ""
          }`}
        >
          {icon}
        </span>
        <input
          id={id}
          className="appearance-none"
          type="radio"
          name="categoryId"
          value={id}
          defaultChecked={isSelected}
        />
        <span className=" w-full text-sm capitalize overflow-hidden text-ellipsis text-center">
          {name[locale as "en" | "ar"]}
        </span>
        <Transition
          isMounted={isSelected}
          as="span"
          className="absolute -right-1 -top-1 p-1 border border-green-400 bg-green-100 ring ring-white rounded-full"
          from="opacity-0 scale-0"
          to="opacity-100 scale-100"
          delay={0}
        >
          <Check className="w-3 h-3 fill-green-600" />
        </Transition>
      </label>
    </li>
  );
}

Category.List = CategoryList;
