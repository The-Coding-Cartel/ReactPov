// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtGtQmF17ZLnumY165DBuFy6GlKqZKv-U",
  authDomain: "povman-3d5f5.firebaseapp.com",
  projectId: "povman-3d5f5",
  storageBucket: "povman-3d5f5.appspot.com",
  messagingSenderId: "55007516442",
  appId: "1:55007516442:web:cff06a96b5b0ceba8bbea3",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const firestore = getFirestore(app);
