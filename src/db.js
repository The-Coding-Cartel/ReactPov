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
  const queryRef = query(scoreRef, orderBy("score", "desc"), limit(10));
  const { docs } = await getDocs(queryRef);
  return docs.map((doc) => doc.data());
};
export const getTopScores = async () => {
  const queryRef = query(scoreRef, orderBy("score", "desc"), limit(5));
  const { docs } = await getDocs(queryRef);
  return docs.map((doc) => doc.data());
};
export const getScoresByUser = async (username) => {
  const endUser = username + "~";
  const queryRef = query(
    scoreRef,
    where("username", ">=", username),
    where("username", "<", endUser),
    limit(5)
  );
  const { docs } = await getDocs(queryRef);
  return docs.map((doc) => doc.data());
};

export const orderByName = async (direction) => {
  const queryRef = query(scoreRef, orderBy("username", direction), limit(5));
  const { docs } = await getDocs(queryRef);
  return docs.map((doc) => doc.data());
};

export const orderByScore = async (direction) => {
  const queryRef = query(scoreRef, orderBy("score", direction), limit(5));
  const { docs } = await getDocs(queryRef);
  return docs.map((doc) => doc.data());
};
export const orderByDate = async (direction) => {
  const queryRef = query(scoreRef, orderBy("posted_at", direction), limit(5));
  const { docs } = await getDocs(queryRef);
  return docs.map((doc) => doc.data());
};
