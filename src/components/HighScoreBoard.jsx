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
    <section className="HighScoreBoard" id="high-scores">
      <h2>High Scores!</h2>
      <ol>
        {highScores.map((scores, index) => (
          <li key={index}>
            {scores.username} Score:{scores.score} points! at{" "}
            {toDate(scores.posted_at.seconds, scores.posted_at.nanoseconds)}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default HighScoreBoard;
