import React from "react";

function Header() {
  return (
    <nav
      className="navbar has-background-primary-light"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          href="#alo"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="#nada">
            Home
          </a>

          <a className="navbar-item" href="#nada">
            Documentation
          </a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary" href="#nada">
                <strong>Sign up</strong>
              </a>
              <a className="button is-light" href="#nada">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
