function Instruction() {
  return (
    <div className="Instruction">
      <h2>Welcome in POVMAZE</h2>{" "}
      <p>
        POVMAZE is a first-person game where the player's view is from within
        the maze. To start game please log in with your google account or use
        the anonymous option{" "}
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
      <img src="\coding cartel.png" alt=""></img>
    </div>
  );
}

export default Instruction;
