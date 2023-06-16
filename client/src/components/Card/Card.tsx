import "./Card.css";

interface cardProps {
  title: string;
  image: string;
}

export function Card({ title, image }: cardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <img src={image} alt={title} />
    </div>
  );
}
