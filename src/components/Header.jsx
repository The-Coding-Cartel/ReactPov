import Nav from "./Nav";

function Header() {
  return (
    <header className="Header">
      <img src="/povmaze-header.png" alt="POVMAZE!"></img>
      <div id="user-icon">User</div>
      <Nav className="Nav" />
    </header>
  );
}

export default Header;
