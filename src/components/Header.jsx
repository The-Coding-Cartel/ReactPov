import Nav from "./Nav";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Cookies from "js-cookie";

function Header({ isLoggedIn, setIsLoggedIn, user, setUser }) {
  const firebaseToken = Cookies.get("firebaseToken");

  if (firebaseToken) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    });
  }
  function handleGoogleLogin() {
    try {
      signInWithPopup(auth, googleProvider).then(({ user }) => {
        setUser(user);
        setIsLoggedIn(true);
        user.getIdToken().then((idToken) => {
          Cookies.set("firebaseToken", idToken, { expires: 1 });
        });
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  function handleAnonymousLogin() {
    signInAnonymously(auth).then(({ user }) => {
      setUser(user);
      setIsLoggedIn(true);
      user.getIdToken().then((idToken) => {
        Cookies.set("firebaseToken", idToken, { expires: 1 });
      });
    });
  }

  function handleSignOut() {
    signOut(auth).then(() => {
      setIsLoggedIn(false);
      Cookies.remove("firebaseToken");
      setUser(null);
    });
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
      {(isLoggedIn || localStorage.user) && (
        <button onClick={() => handleSignOut()}>Logout</button>
      )}
      {!isLoggedIn && !localStorage.user && (
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
