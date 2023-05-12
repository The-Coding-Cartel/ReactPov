function Instruction() {
  return (
    <div className="Instruction">
      <h2>Welcome in POVMAZE</h2>{" "}
      <p>
        Please note that POVMAZE is a web-based game and can only be played on a
        PC using a web browser. For the best experience, we recommend using a
        desktop or laptop computer with a modern web browser such as Google
        Chrome, Mozilla Firefox, or Microsoft Edge. To start game please log in
        with your google account or use the anonymous option{" "}
      </p>
      <h3>Controls</h3>
      <p>
        {" "}
        The controls for the game are as follows: Use the arrow keys to move
        forward, back, left, and right. Press Q to turn left, and E to turn
        right. Hold down the Shift key to sprint.
      </p>
      <p>
        The player must navigate through the maze to reach the end. Along the
        way, they will encounter obstacles and challenges that they must
        overcome to progress. The game is designed to be challenging, so the
        player will need to be strategic and use their wits to make it to the
        end.
      </p>
      <img src="\coding_cartel.png" alt=""></img>
    </div>
  );
}

export default Instruction;
