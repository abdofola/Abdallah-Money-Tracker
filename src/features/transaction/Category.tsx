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
  register,
}: CategoriesProps) {
  const { locale } = useRouter();
  const translation = locale === "en" ? en : ar;

  // console.log({selectedId, categories})
  return (
    <ul className="grid grid-cols-4 gap-4">
      {categories.map((cat) =>
        renderCategory({
          cat,
          isSelected:  selectedId  === cat.iconId,
          icon: (
            <Icon
              className="w-10 h-10"
              href={`/${cat.type}/sprite.svg#${cat.iconId}`}
            />
          ),
          onClick: () => {
             setSelectedId(cat.iconId) ;
          },
          register,
        })
      )}
      <Transition isMounted={Boolean(canAddCategory)}>
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
  register,
}: CategoryProps) {
  const { locale } = useRouter();
  const { color, id, name , iconId} = cat;

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
          className="appearance-none"
          {...register("categoryId", {
            id,
            type: "radio",
            value: iconId,
            defaultChecked: isSelected,
            required: true,
            isControlled: true,
            errorMsg: "Please select one of these categories.",
          })}
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
