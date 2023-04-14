import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { Link, useLocation } from "react-router-dom"
import { NavMenu } from "./NavMenu"

const Layout = () => {
  const location = useLocation()
  const [activeNav, setActiveNav] = useState(false)
  const [prevLoc, setPrevLoc] = useState(location.pathname)

  useEffect(() => {
    // Close Nav Menu after route change
    console.log(location.pathname + " : " + prevLoc)
    if (activeNav && location.pathname != prevLoc) {
      setActiveNav(false)
    }
    setPrevLoc(location.pathname)
  }, [location])

  const handleToggleButtonClick = () => {
    if (activeNav) {
      setActiveNav(false)
    } else {
      setActiveNav(true)
    }
  }

  return (
    <>
      <div className="navbar">
        <div style={{ display: "flex" }}>
          <div className="" style={{ width: "50px" }}>
            <Link to="/">
              <img className="logo" src="/wholesoft.svg" />
            </Link>
          </div>
          <div className="" style={{ width: "170px" }}>
            <Link to="/">
              <h1 className="title text-xl">Wholesoft Notes</h1>
            </Link>
          </div>
        </div>
        <a href="#" className="toggle-button" onClick={handleToggleButtonClick}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </a>
        <div
          className={
            activeNav
              ? "navbar-links text-base active"
              : "navbar-links text-base"
          }
        >
          <NavMenu />
        </div>
      </div>

      <article className="content p-3">
        <Outlet />
      </article>

      <footer className="footer py-3">
        <Link to="/">Wholesoft Notes</Link>
      </footer>
    </>
  )
}

export { Layout }
