function Nav() {
  return (
    <>
      <div>
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
          <a className="navbar-brand" href="#root-id">
            Navbar
          </a>
          <div
            className="collapse navbar-collapse navbar-nav"
            id="navbarTogglerDemo02"
          >
            <a className="nav-link" href="#root-id">
              Play <span className="sr-only"></span>
            </a>

            <a className="nav-link" href="#high-scores">
              High Scores
            </a>
            <a className="nav-link" href="#scores">
              Scores
            </a>
            <a className="nav-link" href="#about">
              About
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Nav;
