import React from "react";
import { Check, Icon, Plus } from "@components/icons";
import { CategoriesProps, CategoryProps } from "./types";
import { useRouter } from "next/router";
import { en, ar } from "@locales";
import { Transition } from "@components/Transition";

export default function CategoryList({
  categories,
  canAddCategory,
  selectedId,
  renderCategory,
  setSelectedId,
  open,
}: CategoriesProps) {
  const [selected, setSelected] = React.useState(null);
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;
  const isControlled = selectedId !== undefined;

  // console.log({ selected, selectedId });

  return (
    <ul className="grid grid-cols-4 gap-4">
      {categories.map((cat) =>
        renderCategory({
          cat,
          isSelected: (!isControlled ? selected : selectedId) === cat.id,
          icon: (
            <Icon
              className="w-10 h-10"
              href={`/${cat.type}/sprite.svg#${cat.iconId}`}
            />
          ),
          onClick: () => {
            if (isControlled) {
              setSelectedId(cat.id);
              return;
            }

            setSelected(cat.id);
          },
        })
      )}
      <Transition isMounted={canAddCategory}>
        <button
          type="button"
          className="flex flex-col justify-center items-center m-auto"
          onClick={open}
        >
          <span className="mt-auto bg-gray-200 rounded-full">
            <Plus className="w-8 h-8" />
          </span>
          <span className="text-sm mt-auto">{translation.buttons.more}</span>
        </button>
      </Transition>
    </ul>
  );
}

export function Category({ cat, isSelected, icon, onClick }: CategoryProps) {
  const { locale } = useRouter();
  const { color, iconId, id, name } = cat;

  return (
    <li>
      <label
        htmlFor={iconId}
        onClick={onClick}
        className={`relative flex flex-col items-center -mx-2 rounded-md cursor-pointer ${
          isSelected ? "bg-gray-100 shadow-inner" : ""
        }`}
      >
        <span
          style={{
            borderBottom: `4px solid ${!isSelected ? color : "transparent"}`,
          }}
          className={`p-2 ${!isSelected ? `rounded-full` : ""}`}
        >
          {icon}
        </span>
        <span className="w-full text-sm capitalize overflow-hidden text-ellipsis text-center">
          {name[locale as "en" | "ar"]}
        </span>
        <input
          className="appearance-none"
          id={iconId}
          type="radio"
          name="categoryId"
          value={id}
          defaultChecked={isSelected}
        />
        {isSelected && (
          <span className="absolute right-1 top-1 p-px border border-green-400 bg-green-100 rounded-full">
            <Check className="w-3 h-3 fill-green-600" />
          </span>
        )}
      </label>
    </li>
  );
}
