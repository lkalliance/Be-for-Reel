import "./Card.css";

interface cardProps {
  title: string;
  image: string;
  index: number;
}

export function Card({ title, image, index }: cardProps) {
  return (
    <div className="card">
      <h2>
        <a href={`/poll/${index}`}>{title}</a>
      </h2>
      <img src={image} alt={title} />
    </div>
  );
}
