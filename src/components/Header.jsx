import { useState } from "react";
import Nav from "./Nav";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <header className="Header">
      <img src="/povmaze-header.png" alt="POVMAZE!"></img>
      <div id="user-icon">User</div>
      {isLoggedIn && <button>Logout</button>}
      {!isLoggedIn && <button>Login</button>}
      <Nav className="Nav" />
    </header>
  );
}

export default Header;
