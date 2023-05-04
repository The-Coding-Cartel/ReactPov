import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "@firebase/firestore";
import { firestore } from "../firebase";

function toDate(seconds, nanoseconds) {
  console.log(seconds, nanoseconds);
  return new Date(seconds * 1000 + nanoseconds / 1000000).toTimeString();
}

function ScoreBoard() {
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const scoreRef = collection(firestore, "scores");
    const get10BestScores = query(
      scoreRef,
      orderBy("score", "desc"),
      limit(10)
    );

    getDocs(get10BestScores)
      .then((querySnapshot) => {
        const highScoresArr = querySnapshot.docs.map((doc) => doc.data());
        setHighScores(highScoresArr);
      })
      .catch((error) => console.log(error));
  }, []);
  console.log(highScores);

  return (
    <section id="scores">
      <ol>
        {highScores.map((scores) => (
          <li key={scores.posted_at.nanoseconds}>
            {scores.username} {scores.score}{" "}
            {toDate(scores.posted_at.seconds, scores.posted_at.nanoseconds)}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default ScoreBoard;
