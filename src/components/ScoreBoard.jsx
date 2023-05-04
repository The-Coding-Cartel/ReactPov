import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  where,
} from "@firebase/firestore";
import { firestore } from "../firebase";
import moment from "moment";

function toDate(seconds, nanoseconds) {
  let yourDate = moment(
    new Date(seconds * 1000 + nanoseconds / 1000000).toLocaleDateString(),
    "D/M/YYYY"
  ).format("DD-MM-YYYY");
  //   console.log(nanoseconds, seconds);

  return yourDate;
}

function ScoreBoard() {
  const [highScores, setHighScores] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  console.log(searchUser);

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

  function handleSubmit(e) {
    e.preventDefault();
    const scoreRef = collection(firestore, "scores");
    const getScoresByUsers = query(
      scoreRef,
      where("username", "==", searchUser)
      //   orderBy("score", "asc")
    );
    getDocs(getScoresByUsers)
      .then((querySnapshot) => {
        const scoresByUserArr = querySnapshot.docs.map((doc) => doc.data());
        setHighScores(scoresByUserArr);
      })
      .catch((error) => console.log(error));
  }

  return (
    <section id="scores">
      <form onSubmit={handleSubmit}>
        <label htmlFor="user-search">Search User: </label>
        <input
          type="text"
          id="user-search"
          value={searchUser}
          onChange={(event) => {
            setSearchUser(event.target.value);
          }}
        />
        <button>Go</button>
      </form>
      <table class="table" id="">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">User Name</th>
            <th scope="col">Scores</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {highScores.map((scores, index) => (
            // <tr key={scores.posted_at.nanoseconds}>
            <tr>
              <th scope="row">{index + 1}</th>
              <td>{scores.username}</td>
              <td>{scores.score}</td>
              <td>
                {/* {toDate(scores.posted_at.seconds, scores.posted_at.nanoseconds)} */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ScoreBoard;
