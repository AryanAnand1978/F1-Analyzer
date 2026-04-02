import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import "../css/Races.css";
import { getRaces } from "../services/api";

const Races = () => {
  const currentYear = new Date().getFullYear();

  const [season, setSeason] = useState(currentYear.toString());
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Generate seasons dynamically (1950 → current year)
  const seasons = useMemo(() => {
    const startYear = 1950;
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear]);

  useEffect(() => {
    const fetchRaces = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRaces(season);
        setRaces(data?.MRData?.RaceTable?.Races || []);
      } catch (err) {
        setError("Could not load races.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, [season]);

  return (
    <div className="races-page">

      {/* HEADER */}
      <header className="races-header">
        <h1 className="page-title">
          Race <span className="red">Calendar</span>
        </h1>

        <div className="season-selector">
          <label htmlFor="season">SELECT SEASON</label>
          <div className="select-wrapper">
            <select
              id="season"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            >
              {seasons.map((year) => (
                <option key={year} value={year}>
                  {year} Season
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* STATUS */}
      {loading && <p style={{ color: "white" }}>Loading races...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <p style={{ color: "white" }}>
          Total races: {races.length}
        </p>
      )}

      {/* RACE LIST */}
      <main className="race-container">
        <div className="race-list">
          <div className="race-list-header">
            <span>RND</span>
            <span>GRAND PRIX</span>
            <span>CIRCUIT</span>
            <span>DATE</span>
            <span>STATUS</span>
          </div>

          {races.map((race) => {
            const raceDateTime = new Date(
              `${race.date}T${race.time || "00:00:00Z"}`
            );

            const today = new Date();
            let status;

            if (raceDateTime.toDateString() === today.toDateString()) {
              status = "Today";
            } else if (raceDateTime > today) {
              status = "Upcoming";
            } else {
              status = "Completed";
            }

            return (
              <div key={race.round} className="race-row">
                <span className="round-num">{race.round}</span>

                <div className="race-info">
                  <span className="race-name">{race.raceName}</span>
                  <span className="mobile-only">
                    {race.Circuit.Location.locality}
                  </span>
                </div>

                <span className="circuit-name">
                  {race.Circuit.circuitName}
                </span>

                <span className="race-date">{race.date}</span>

                <span
                  className={`race-status ${status === "Upcoming"
                    ? "status-upcoming"
                    : status === "Today"
                      ? "status-today"
                      : "status-completed"
                    }`}
                >
                  {status}
                </span>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Races;
