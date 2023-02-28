import { Icon } from "@components/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { DisplayAmount } from "./index";
import { TransactionItemProps } from "./types";

const TransactionItem: React.FC<TransactionItemProps> = ({
  item,
  href,
  percentage,
  withComment = false,
}) => {
  const { locale } = useRouter();
  const { amount, category, comment } = item;

  return (
    <li
      style={{ borderInlineStart: `4px solid ${category.color}` }}
      className="border border-gray-100 rounded-lg overflow-clip"
    >
      <Link href={href}>
        <a className="flex justify-between bg-white p-2 ">
          <div className="flex gap-2">
            <span>
              <Icon
                href={`/${category.type}/sprite.svg#${category.iconId}`}
                className="w-6 h-6"
              />
            </span>
            <div>
              <span className="text-gray-800 capitalize">
                {category.name[locale]}
              </span>
              {withComment && (
                <p className="w-44 text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
                  {comment}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {percentage && <span className=" text-gray-300">{percentage}</span>}
            <DisplayAmount
              className="text-gray-800 text-sm font-medium"
              amount={amount}
            />
          </div>
        </a>
      </Link>
    </li>
  );
};

export default TransactionItem;
