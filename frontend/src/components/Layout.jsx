import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          F1<span className="red">APEX</span>
        </div>

        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/races">Races</Link></li>
          <li><Link to="/drivers">Drivers</Link></li>
          <li><Link to="/teams">Teams</Link></li>
          <li><Link to="/analyzer">Analyzer</Link></li>
          <li><Link to="/predictor">Predictor</Link></li>
          <li><Link to="/history">History</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
      </nav>
        <div className="page-content">{children}</div>


      
    </>
  );
}

export default Layout;
