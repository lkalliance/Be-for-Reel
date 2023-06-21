import "./Nav.css";

export function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <a href="/login">Log in</a>
        </li>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/polls">Polls</a>
        </li>
      </ul>
    </nav>
  );
}
