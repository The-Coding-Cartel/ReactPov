import { useState, useEffect } from "react";
import moment from "moment";
import { getScores, getScoresByUser } from "../db";

function toDate(seconds, nanoseconds) {
  let yourDate = moment(
    new Date(seconds * 1000 + nanoseconds / 1000000).toLocaleDateString(),
    "D/M/YYYY"
  ).format("DD-MM-YYYY");
  return yourDate;
}

function ScoreBoard() {
  const [highScores, setHighScores] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  useEffect(() => {
    getScores()
      .then((scores) => setHighScores(scores))
      .catch((error) => console.log(error));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const scoresByUserArr = await getScoresByUser(searchUser);
      setHighScores(scoresByUserArr);
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
            <th scope="col">User Name</th>
            <th scope="col">Scores</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {highScores.map((score, index) => (
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
