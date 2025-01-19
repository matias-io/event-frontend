import Link from 'next/link'

type CardProps = {
  name: string;
  minPrice: number;
  time: number;  // Unix timestamp of the event time
};

const Card = ({ name, minPrice, time }: CardProps) => {
  const isUpcoming = Date.now() < time * 1000; // Compare with current time in milliseconds
  const statusColor = isUpcoming ? 'bg-green-500' : 'bg-red-500';

  return (
    <Link href={"/room/" + name}>
      <div className="max-w-sm w-full bg-white border rounded-lg shadow-lg overflow-hidden m-4">
        <div className={`p-4 ${statusColor} text-white text-center`}>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm">{isUpcoming ? "Room Active" : "Room Closed"}</p>
        </div>
        <div className="p-4">
          <p className="font-semibold text-gray-700">
            Minimum Price: <span className="text-gray-500">${minPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Card;
