import Card from './Card'

type CardProps = {
  stockName: string;
  price: number;
  change: number;
};

const API_KEY: string = "Yx3cN0Y4U3CboQxpNgvv6LohV6Vr43jJ";

const URL: string = "https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-09/2023-01-09";

const CardContainer = ({ cards }: { cards: CardProps[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
    {cards.map((card, index) => (
      <Card  key={index} {...card} />
    ))}
  </div>
);



export default CardContainer;
