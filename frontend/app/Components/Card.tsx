import Link from 'next/link'

type CardProps = {
  market_type: string;
  region: string;
  primary_exchanges: string;
  local_open: string;
  local_close: string;
  current_status: string;
  notes: string;
};

const Card = ({
  market_type,
  region,
  primary_exchanges,
  local_open,
  local_close,
  current_status,
  notes,
}: CardProps) => {
  const statusColor = current_status === 'open' ? 'bg-green-500' : 'bg-red-500';

  return (
    <Link
      href={"/room/" + region}>
    
    <div className="max-w-sm w-full bg-white border rounded-lg shadow-lg overflow-hidden m-4">
      <div className={`p-4 ${statusColor} text-white text-center`}>
        <h2 className="text-xl font-bold">{region}</h2>
        <p className="text-sm">{market_type} Market</p>
      </div>
      <div className="p-4">
        <p className="font-semibold text-gray-700">
          Primary Exchanges: <span className="text-gray-500">{primary_exchanges}</span>
        </p>
        <p className="font-semibold text-gray-700">
          Opening Hours: <span className="text-gray-500">{local_open} - {local_close}</span>
        </p>
        {notes && (
          <p className="mt-2 text-gray-600 italic">Notes: {notes}</p>
        )}
        <p className={`mt-2 text-white py-1 px-3 rounded-full ${statusColor} inline-block`}>
          Status: {current_status}
        </p>
      </div>
    </div>
    
    </Link>
  );
};

export default Card;
