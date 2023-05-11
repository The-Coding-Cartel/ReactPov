function About() {
  return (
    <section id="about" className="About">
      <h1>ABOUT!</h1>
      <p>
        POVMAZE is a game built in just 7 days using React, Phaser, and
        Firebase. The project began as a 2D version of Pacman, but over the
        course of the week, the team expanded it into a fully-realized 3D maze
        runner with raycasting.
      </p>
      <p>
        The game is designed to be played from a first-person point of view,
        immersing the player in the game world. The objective is to navigate
        through the maze, collecting items and avoiding obstacles.
      </p>
      <p>
        One of the key features of the game is the use of raycasting, a
        technique that simulates the behavior of light rays to create 3D
        graphics in real-time. This allows for realistic rendering of the maze
        and its surroundings, and creates a more immersive experience for the
        player.
      </p>
      <p>
        Throughout the development process, the team faced numerous challenges,
        from optimizing performance to fine-tuning the game mechanics. However,
        the end result is a polished and engaging game that demonstrates the
        power of modern web technologies.
      </p>
      <p>
        POVMAZE is a testament to the creativity and ingenuity of the{" "}
        <a
          href="https://github.com/The-Coding-Cartel"
          target="_blank"
          rel="noreferrer"
        >
          The Coding Cartel
        </a>{" "}
        team behind it, who were able to build a complex and engaging game in
        just 7 days.
      </p>
    </section>
  );
}

export default About;
