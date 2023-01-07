const DisplayAmount: React.FC<{
    amount: number;
    currency?: string;
    className?: string;
  }> = ({ amount, className, currency = "SDG" }) => {
    const renderedAmount = Number(amount).toFixed(2).toString().concat(` ${currency}`);
    return <span className={className}>{renderedAmount}</span>;
  };

  export default DisplayAmount;