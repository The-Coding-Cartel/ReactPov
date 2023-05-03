import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from "@firebase/firestore";
import { firestore } from "../firebase";

const scoreRef = collection(firestore, "scores");
const get10BestScores = query(scoreRef, orderBy("score", "desc"), limit(10));
const highScores = [];
getDocs(get10BestScores).then((querySnapshot) => {
  querySnapshot.forEach((doc) => {
    highScores.push(doc.data());
  });
  console.log(highScores);
});
function ScoreBoard() {
  return (
    <section id="scores">
      <ol>
        {highScores.map((scores) => {
          return <li>{scores.username}</li>;
        })}
      </ol>
    </section>
  );
}

export default ScoreBoard;
