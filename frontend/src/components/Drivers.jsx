import { useState, useMemo, useEffect } from "react";
import DriversCard from "../components/DriversCard";
import { useNavigate } from "react-router-dom";
import "../css/drivers.css";

function Drivers() {
  const currentYear = new Date().getFullYear();
  const [season, setSeason] = useState(currentYear.toString());
  const [drivers, setDrivers] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const navigate = useNavigate();

  const seasons = useMemo(() => {
    const startYear = 1950;
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear]);



  // 🔥 FETCH DRIVER STANDINGS
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`
        );
        const data = await response.json();

        const standingsLists = data.MRData.StandingsTable.StandingsLists;

        if (!standingsLists || standingsLists.length === 0) {
          setDrivers([]);
          return;
        }

        const standings = standingsLists[0].DriverStandings;

        const mappedDrivers = standings.map((item) => ({
          id: item.Driver.driverId,
          name: `${item.Driver.givenName} ${item.Driver.familyName}`,
          team: item.Constructors[0]?.name || "Unknown",
          nationality: item.Driver.nationality,
          position: item.position,
          points: item.points,
          wins: item.wins,
          podiums: "N/A", // Ergast doesn't directly give podium count here
        }));

        setDrivers(mappedDrivers);
        setSelectedDrivers([]); // reset selection on season change
      } catch (error) {
        console.error("Error fetching drivers:", error);
      }
    };

    fetchDrivers();
  }, [season]);




  const handleSelect = (driverId) => {
    if (selectedDrivers.includes(driverId)) {
      setSelectedDrivers(selectedDrivers.filter((id) => id !== driverId));
    } else {
      if (selectedDrivers.length < 2) {
        setSelectedDrivers([...selectedDrivers, driverId]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedDrivers.length === 2) { 
      navigate(
        `/analyzer/drivers?season=${season}&d1=${selectedDrivers[0]}&d2=${selectedDrivers[1]}`
      );
    }
  };

  return (
    <div className="drivers-page">

      <div className="drivers-header">
        <h1>Drivers - {season}</h1>

        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="season-select"
        >
          {seasons.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {drivers.length === 0 ? (
        <p style={{ marginTop: "40px" }}>
          No standings available for this season.
        </p>
      ) : (
        <div className="drivers-grid">
          {drivers.map((driver) => (
            <DriversCard
              key={driver.id}
              driver={driver}
              isSelected={selectedDrivers.includes(driver.id)}
              onSelect={() => handleSelect(driver.id)}
              disableCheckbox={
                !selectedDrivers.includes(driver.id) &&
                selectedDrivers.length >= 2
              }
            />
          ))}
        </div>
      )}

      {/* 👇 Compare Bar MUST be inside main wrapper */}
      {selectedDrivers.length > 0 && (
        <div className="compare-bar">
          <span>
            Selected: {selectedDrivers.length} / 2
          </span>

          <button
            onClick={handleCompare}
            disabled={selectedDrivers.length !== 2}
            className="compare-btn"
          >
            Compare in Analyzer
          </button>
        </div>
      )}

    </div>
  );
}

export default Drivers;