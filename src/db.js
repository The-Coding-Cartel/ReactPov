import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import { firestore } from "./firebase";

const scoreRef = collection(firestore, "scores");

export const getScores = async () => {
  const queryRef = query(scoreRef, orderBy("score", "desc"), limit(20));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};
export const getTopScores = async () => {
  const queryRef = query(scoreRef, orderBy("score", "desc"), limit(10));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};
export const getScoresByUser = async (username) => {
  const endUser = username + "~";
  const queryRef = query(
    scoreRef,
    where("username", ">=", username),
    where("username", "<", endUser)
  );
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => {
    return doc.data();
  });
};

export const orderByNameDesc = async () => {
  const queryRef = query(scoreRef, orderBy("username", "desc"), limit(20));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};

export const orderByNameAsc = async () => {
  const queryRef = query(scoreRef, orderBy("username", "asc"), limit(20));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};

export const orderByScoreAsc = async () => {
  const queryRef = query(scoreRef, orderBy("score", "asc"), limit(20));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};
export const orderByScoreDesc = async () => {
  const queryRef = query(scoreRef, orderBy("score", "desc"), limit(20));
  const snapshot = await getDocs(queryRef);
  return snapshot.docs.map((doc) => doc.data());
};
