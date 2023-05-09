import Nav from "./Nav";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

function Header({ isLoggedIn, setIsLoggedIn }) {
  const [user, setUser] = useState();

  function handleGoogleLogin() {
    signInWithPopup(auth, googleProvider).then(({ user }) => {
      setUser(user);
      setIsLoggedIn(true);
    });
  }

  function handleSignOut() {
    signOut(auth).then(setIsLoggedIn(false));
  }

  return (
    <header className="Header">
      <img src="/povmaze-header.png" alt="POVMAZE!"></img>
      <div id="user-icon">User</div>
      {isLoggedIn && <button onClick={() => handleSignOut()}>Logout</button>}
      {!isLoggedIn && (
        <button onClick={handleGoogleLogin}>
          <span>Login with Google</span>
        </button>
      )}

      <Nav className="Nav" />
    </header>
  );
}

export default Header;
