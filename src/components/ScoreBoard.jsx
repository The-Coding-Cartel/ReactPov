import { useState, useEffect } from "react";
import moment from "moment";
import {
  getScores,
  getScoresByUser,
  orderByName,
  orderByScore,
  orderByDate,
  getNextScores,
  getPreviousScores,
} from "../db";

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
  const [direction, setDirection] = useState("desc");
  const [last, setLast] = useState();
  const [first, setFirst] = useState();
  const [count, setCount] = useState(0);

  useEffect(() => {
    getScores()
      .then((snapShot) => {
        setScores(() => {
          return snapShot.docs.map((doc) => doc.data());
        });
        let lastDoc = snapShot.docs[snapShot.docs.length - 1];
        setLast(lastDoc);
        let firstDoc = snapShot.docs[0];
        setFirst(firstDoc);
      })
      .catch((error) => console.log(error));
  }, []);

  async function nextScores() {
    try {
      const snapShot = await getNextScores(last);
      if (snapShot.docs.length > 0) {
        setCount((currentCount) => {
          return currentCount + 5;
        });
        setScores(() => {
          return snapShot.docs.map((doc) => doc.data());
        });
        let lastDoc = snapShot.docs[snapShot.docs.length - 1];
        setLast(lastDoc);
        let firstDoc = snapShot.docs[0];
        setFirst(firstDoc);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function previousScores() {
    try {
      const snapShot = await getPreviousScores(first);
      if (snapShot.docs.length === 5) {
        setCount((currentCount) => {
          return currentCount - 5 <= 0 ? 0 : currentCount - 5;
        });
        setScores(() => {
          const socresArr = snapShot.docs.map((doc) => doc.data());
          const sortedArr = socresArr.sort((a, b) => b.score - a.score);
          return sortedArr;
        });
        let lastDoc = snapShot.docs[0];
        setLast(lastDoc);
        let firstDoc = snapShot.docs[snapShot.docs.length - 1];
        setFirst(firstDoc);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const scoresByUserArr = await getScoresByUser(searchUser);
      setScores(scoresByUserArr.sort((a, b) => b.score - a.score));
      setSearchUser(searchUser);
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
  async function handleSortByScore() {
    try {
      const newDirection = direction === "desc" ? "asc" : "desc";
      const scoresByUserArr = await orderByScore(newDirection);
      setScores(scoresByUserArr);
      setDirection(newDirection);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSortByDate() {
    try {
      const newDirection = direction === "desc" ? "asc" : "desc";
      const scoresByUserArr = await orderByDate(newDirection);
      setScores(scoresByUserArr);
      setDirection(newDirection);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section className="ScoreBoard" id="scores">
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
                <i className="fa-solid fa-sort"></i>
              </button>
            </th>

            <th scope="col">
              Scores{" "}
              <button onClick={handleSortByScore} value="descending">
                <i className="fa-solid fa-sort"></i>
              </button>
            </th>
            <th scope="col">
              Date
              <button onClick={handleSortByDate} value="descending">
                <i className="fa-solid fa-sort"></i>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={index}>
              <th scope="row">{index + 1 + count}</th>
              <td>{score.username}</td>
              <td>{score.score}</td>
              <td>
                {toDate(score.posted_at.seconds, score.posted_at.nanoseconds)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li className="page-item">
            {
              <button className="page-link" onClick={previousScores}>
                Previous
              </button>
            }
          </li>

          <li className="page-item load-more">
            <button className="page-link" onClick={nextScores}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}

export default ScoreBoard;
