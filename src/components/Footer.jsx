function Footer() {
  const BGS89 = "https://github.com/BGS89";
  const SomeRandomGuy64 = "https://github.com/SomeRandomGuy64";
  const Entelodonto = "https://github.com/Entelodonto";
  const gumbercules35 = "https://github.com/gumbercules35";
  const szpytmaGithub = "https://github.com/Szpytma/";
  let year = new Date().getFullYear();

  return (
    <footer className="Footer">
      Created by{" "}
      <a href={BGS89} target="_blank" rel="noreferrer">
        BGS89
      </a>{" "}
      ,
      <a href={Entelodonto} target="_blank" rel="noreferrer">
        Entelodonto
      </a>{" "}
      ,
      <a href={gumbercules35} target="_blank" rel="noreferrer">
        gumbercules35
      </a>{" "}
      ,
      <a href={SomeRandomGuy64} target="_blank" rel="noreferrer">
        SomeRandomGuy64
      </a>{" "}
      ,
      <a href={szpytmaGithub} target="_blank" rel="noreferrer">
        Szpytma
      </a>{" "}
      ® {year}
    </footer>
  );
}

export default Footer;
