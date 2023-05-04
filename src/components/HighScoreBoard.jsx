import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from "@firebase/firestore";
import { firestore } from "../firebase";
import moment from "moment";

function toDate(seconds, nanoseconds) {
  let yourDate = moment(
    new Date(seconds * 1000 + nanoseconds / 1000000).toLocaleDateString(),
    "D/M/YYYY"
  ).format("DD-MM-YYYY");

  return yourDate;
}

function HighScoreBoard() {
  const [highScores, setHighScores] = useState([]);
  useEffect(() => {
    const scoreRef = collection(firestore, "scores");
    const get10BestScores = query(scoreRef, orderBy("score", "desc"), limit(5));

    getDocs(get10BestScores)
      .then((querySnapshot) => {
        const highScoresArr = querySnapshot.docs.map((doc) => doc.data());
        setHighScores(highScoresArr);
      })
      .catch((error) => console.log(error));
  }, []);

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

export default HighScoreBoard;
