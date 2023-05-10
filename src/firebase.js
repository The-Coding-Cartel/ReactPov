import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "povmaze.firebaseapp.com",
  projectId: "povmaze",
  storageBucket: "povmaze.appspot.com",
  messagingSenderId: "435801376958",
  appId: process.env.REACT_APP_APP_ID,
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
