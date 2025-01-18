type CardProps = {
  stockName: string;
  price: number;
  change: number;
};

const Card = ({ stockName, price, change }: CardProps) => (
  <div className="bg-white rounded-lg shadow-lg p-6 w-full">
    <h2 className="text-xl font-semibold mb-2">{stockName}</h2>
    <p className="text-gray-600 mb-4">Price: ${price.toFixed(2)}</p>
    <p className={`text-lg ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
      Change: {change > 0 ? `+${change.toFixed(2)}` : `${change.toFixed(2)}`}%
    </p>
  </div>
);

export default Card;
