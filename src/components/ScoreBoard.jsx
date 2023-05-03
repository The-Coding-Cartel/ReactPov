import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from "@firebase/firestore";
import { firestore } from "../firebase";
import { useState } from "react";

function ScoreBoard() {
  const [highScores, setHighScores] = useState([]);

  const scoreRef = collection(firestore, "scores");
  const get10BestScores = query(scoreRef, orderBy("score", "desc"), limit(10));

  const highScoresArr = [];

  getDocs(get10BestScores).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      highScoresArr.push(doc.data());
    });
    setHighScores(highScoresArr);
  });

  return (
    <section id="scores">
      <ol>
        {highScores.map((scores) => {
          return (
            <li>
              {scores.username} {scores.score}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default ScoreBoard;
