import "./UserIcon.css";

interface userIconProps {
  username: string;
  big?: boolean;
  thisUser?: boolean;
}

export function UserIcon({ username, big, thisUser }: userIconProps) {
  const removeThese = ["a", "the", "in", "of", "on", "and", "or"];
  const pieces = username.split(" ");
  let secondPiece = "";
  pieces.forEach((piece: string, index: number) => {
    if (
      index !== 0 &&
      removeThese.indexOf(piece) === -1 &&
      secondPiece.length === 0
    ) {
      secondPiece = piece[0];
    }
  });
  const inits = `${pieces[0][0]}${secondPiece}`;
  return (
    <div
      className={`user-inits${
        big ? (thisUser ? " big you-data" : " big user-data") : ""
      }`}
    >
      {inits.toUpperCase()}
    </div>
  );
}
