import { Icon } from "@components/icons";
import { DisplayAmount } from "./index";
import { TransactionItemProps } from "./types";

const TransactionItem: React.FC<TransactionItemProps> = ({
  item,
  percentage,
  withComment=false,
}) => {
  const { id, amount, category, comment } = item;

  return (
    <li
      key={id}
      style={{ borderLeftColor: `${category.color}` }}
      className="flex justify-between bg-white p-2 border border-gray-100 border-l-4 rounded-lg"
    >
      <div className="flex gap-2">
        <span>
          <Icon
            href={`${category.type}/sprite.svg#${category.iconId}`}
            className="w-6 h-6"
          />
        </span>
        <div>
          <span className="text-gray-800 capitalize">{category.name}</span>
          {withComment && (
            <p className="w-44 text-gray-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {comment}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <span className=" text-gray-300">{percentage}</span>
        <DisplayAmount className="text-gray-800 font-medium" amount={amount} />
      </div>
    </li>
  );
};

export default TransactionItem;
