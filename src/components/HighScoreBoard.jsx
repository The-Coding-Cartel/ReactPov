import { useState, useEffect } from "react";
import moment from "moment";
import { getTopScores } from "../db";

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
    getTopScores()
      .then((scores) => setHighScores(scores))
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
