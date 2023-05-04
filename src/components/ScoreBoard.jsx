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

function ScoreBoard() {
  const users = [{ score: 360, username: "Ben Sivyer" }];
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const scoreRef = collection(firestore, "scores");
    const get10BestScores = query(
      scoreRef,
      orderBy("score", "desc"),
      limit(20)
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
      <table class="table" id="">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">UserName</th>
            <th scope="col">scores</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          {highScores.map((scores, index) => (
            <tr key={scores.posted_at.nanoseconds}>
              <th scope="row">{index + 1}</th>
              <td>{scores.username}</td>
              <td>{scores.score}</td>
              <td>
                {toDate(scores.posted_at.seconds, scores.posted_at.nanoseconds)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ScoreBoard;
