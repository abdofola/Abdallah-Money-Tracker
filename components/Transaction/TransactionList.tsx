import React from "react";

const TransactionList: React.FC = ({ data, renderItem, className }) => {
  const [ref, setRef] = React.useState<HTMLUListElement | null>(null);
  const [isScrollable, setIsScrollable] = React.useState(false);
  const [before, setBefore] = React.useState(false);
  const handleScroll = () => {
    if (ref) isScrollable ? setBefore(ref.scrollTop > 0) : null;
  };
  const refCallBack = (node: HTMLUListElement | null) => {
    if (node) {
      setRef(node);
      setIsScrollable(node.scrollHeight > node.clientHeight ? true : false);
      setBefore(node.scrollTop > 0);
    } else {
      //clear
      setRef(null);
    }
  };

  return (
    <ul
      onScroll={handleScroll}
      ref={refCallBack}
      className={className.concat(
        " ",
        isScrollable ? (before ? "before" : "after") : ""
      )}
    >
      {data.map((item) => renderItem(item))}
    </ul>
  );
};

export { TransactionList as default };
