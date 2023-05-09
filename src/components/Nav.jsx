function Nav({ isLoggedIn }) {
  return (
    <>
      <div>
        <nav className=" Nav navbar navbar-expand-sm navbar-light bg-dark ">
          {/* <a className="navbar-brand" href="#root-id">
            Navbar
          </a> */}
          <div className="navbar-nav">
            {isLoggedIn && (
              <a className="nav-link" href="#root-id">
                Play <span className="sr-only"></span>
              </a>
            )}

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
