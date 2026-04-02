import React from 'react';
import { useNavigate } from "react-router-dom";
import "../css/AnalyzerHome.css";

// Import images (optional, since you're using CSS classes)
import DriversImage from "../assets/images/drivers/drivers.jpg";
import TeamsImage from "../assets/images/teams/teams.jpg";

function AnalyzerHome() {
  const navigate = useNavigate();

  return (
    <div className="analyzer-page">
      <h1 className="main-title">
        <span className="white-text">F1</span>{" "}
        <span className="red-text">ANALYZER</span>
      </h1>

      <div className="wide-card-container">

        {/* Driver Card */}
        <div
          className="f1-card"
          onClick={() => navigate("/drivers")}   // ✅ FIXED
        >
          <div className="card-image driver-img"></div>

          <div className="card-content">
            <div className="text-section">
              <h2>DRIVER ANALYZER</h2>
              <p>Performance metrics & career stats</p>

              <div className="long-arrow-wrapper">
                <div className="long-arrow-line"></div>
                <span className="arrow-head">→</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Card */}
        <div
          className="f1-card reverse"
          onClick={() => navigate("/teams")}   // ✅ FIXED
        >
          <div className="card-image team-img"></div>

          <div className="card-content">
            <div className="text-section">
              <h2>TEAM ANALYZER</h2>
              <p>Constructor data & pit efficiency</p>

              <div className="long-arrow-wrapper">
                <span className="arrow-head">←</span>
                <div className="long-arrow-line"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AnalyzerHome;