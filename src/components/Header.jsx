import Nav from "./Nav";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signOut, signInAnonymously } from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

function Header({ isLoggedIn, setIsLoggedIn, user, setUser }) {
  function handleGoogleLogin() {
    try {
      signInWithPopup(auth, googleProvider).then(({ user }) => {
        setUser(user);
        setIsLoggedIn(true);
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  function handleAnonymousLogin() {
    signInAnonymously(auth).then(({ user }) => {
      setUser(user);
      setIsLoggedIn(true);
    });
  }

  function handleSignOut() {
    signOut(auth).then(setIsLoggedIn(false));
    setUser(null);
  }

  return (
    <header className="Header">
      <img src="/povmaze-header.png" alt="POVMAZE!"></img>

      <div id="user-icon">
        {isLoggedIn && user.displayName && (
          <div>
            {" "}
            <p>{user.displayName}</p> <img src={user.photoURL} alt="" />
          </div>
        )}
      </div>
      {isLoggedIn && <button onClick={() => handleSignOut()}>Logout</button>}
      {!isLoggedIn && (
        <div>
          <button onClick={handleGoogleLogin}>
            <FontAwesomeIcon icon={faGoogle} /> Log in with google
          </button>
          <button onClick={handleAnonymousLogin}>
            🐱‍👤Log in Anonymously
          </button>
        </div>
      )}

      <Nav className="Nav" isLoggedIn={isLoggedIn} />
    </header>
  );
}

export default Header;
