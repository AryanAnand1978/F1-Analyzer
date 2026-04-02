import { useState, useMemo, useEffect } from "react";
import TeamsCard from "../components/TeamsCard";
import { useNavigate } from "react-router-dom";
import "../css/teams.css";

function Teams() {
  const currentYear = new Date().getFullYear();
  const [season, setSeason] = useState(currentYear.toString());
  const [teams, setTeams] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const navigate = useNavigate();

  const seasons = useMemo(() => {
    const startYear = 1958; // constructors started later
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear]);

  // 🔥 FETCH TEAM (CONSTRUCTOR) STANDINGS
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`
        );
        const data = await response.json();

        const standingsLists =
          data.MRData.StandingsTable.StandingsLists;

        if (!standingsLists || standingsLists.length === 0) {
          setTeams([]);
          return;
        }

        const standings = standingsLists[0].ConstructorStandings;

        const mappedTeams = standings.map((item) => ({
          id: item.Constructor.constructorId,
          name: item.Constructor.name,
          nationality: item.Constructor.nationality,
          position: item.position,
          points: item.points,
          wins: item.wins,
        }));

        setTeams(mappedTeams);
        setSelectedTeams([]); // reset selection on season change
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [season]);

  const handleSelect = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    } else {
      if (selectedTeams.length < 2) {
        setSelectedTeams([...selectedTeams, teamId]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedTeams.length === 2) {
      navigate(
        `/analyzer/teams?season=${season}&t1=${selectedTeams[0]}&t2=${selectedTeams[1]}`
      );
    }
  };

  return (
    <div className="teams-page">

      <div className="teams-header">
        <h1>Teams - {season}</h1>

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

      {teams.length === 0 ? (
        <p style={{ marginTop: "40px" }}>
          No constructor standings available for this season.
        </p>
      ) : (
        <div className="teams-grid">
          {teams.map((team) => (
            <TeamsCard
              key={team.id}
              team={team}
              isSelected={selectedTeams.includes(team.id)}
              onSelect={() => handleSelect(team.id)}
              disableCheckbox={
                !selectedTeams.includes(team.id) &&
                selectedTeams.length >= 2
              }
            />
          ))}
        </div>
      )}

      {/* 🔥 Compare Bar */}
      {selectedTeams.length > 0 && (
        <div className="compare-bar">
          <span>
            Selected: {selectedTeams.length} / 2
          </span>

          <button
            onClick={handleCompare}
            disabled={selectedTeams.length !== 2}
            className="compare-btn"
          >
            Compare in Analyzer
          </button>
        </div>
      )}

    </div>
  );
}

export default Teams;