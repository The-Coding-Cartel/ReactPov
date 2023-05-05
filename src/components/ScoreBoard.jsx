import { useState, useEffect } from "react";
import moment from "moment";
import { getScores, getScoresByUser, orderByName } from "../db";

function toDate(seconds, nanoseconds) {
  let yourDate = moment(
    new Date(seconds * 1000 + nanoseconds / 1000000).toLocaleDateString(),
    "D/M/YYYY"
  ).format("DD-MM-YYYY");
  return yourDate;
}

function ScoreBoard() {
  const [scores, setScores] = useState([]);
  const [searchUser, setSearchUser] = useState("");
  const [direction, setDirection] = useState("asc");

  useEffect(() => {
    getScores()
      .then((scores) => setScores(scores))
      .catch((error) => console.log(error));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const scoresByUserArr = await getScoresByUser(searchUser);
      setScores(scoresByUserArr.sort((a, b) => b.score - a.score));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSortByName() {
    try {
      const newDirection = direction === "desc" ? "asc" : "desc";
      const scoresByUserArr = await orderByName(newDirection);
      setScores(scoresByUserArr);
      setDirection(newDirection);
    } catch (error) {
      console.log(error);
    }
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
      <table className="table" id="">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">
              User Name
              <button onClick={handleSortByName} value="descending">
                <i class="fa-solid fa-sort"></i>
              </button>
            </th>

            <th scope="col">Scores</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{score.username}</td>
              <td>{score.score}</td>
              <td>
                {toDate(score.posted_at.seconds, score.posted_at.nanoseconds)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ScoreBoard;
