import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { firestore } from "./firebase";

export const getScores = async () => {
  const scoreRef = collection(firestore, "scores");
  const queryRef = query(scoreRef, orderBy("posted_at", "desc"), limit(25));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};
export const getTopScores = async () => {
  const scoreRef = collection(firestore, "scores");
  const queryRef = query(scoreRef, orderBy("score", "desc"), limit(10));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};

export const getScoresByUser = async (username) => {
  const scoreRef = collection(firestore, "scores");
  const endUser = username + "~";
  const queryRef = query(
    scoreRef,
    where("username", ">=", username),
    where("username", "<", endUser)
  );
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => {
    console.log(doc.data());
    return doc.data();
  });
};
