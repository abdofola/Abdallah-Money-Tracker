import { DisplayAmount } from "./index";

const TransactionItem: React.FC = ({ item, percentage }) => {
  return (
    <li
      key={item.id}
      className="flex bg-white p-2 border border-gray-100 rounded-lg"
    >
      <span className="text-gray-900 capitalize">{item.category}</span>
      <span className="ml-auto text-gray-400">
        {percentage.toString().concat("%")}
      </span>
      <DisplayAmount
        className="flex items-center ml-3 text-gray-700  font-serif font-medium"
        amount={item.amount}
      />
    </li>
  );
};

export default TransactionItem;
