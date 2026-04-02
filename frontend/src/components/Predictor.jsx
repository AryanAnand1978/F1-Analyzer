import { useState, useEffect, useMemo } from "react";
import Chatbot from "./Chatbot";
import "../css/predictor.css";

function Predictor() {
  const currentYear = new Date().getFullYear();
  const [season, setSeason] = useState(currentYear.toString());
  const [drivers, setDrivers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);

  // Generate season options
  const seasons = useMemo(() => {
    const startYear = 2000;
    const years = [];
    for (let year = currentYear; year >= startYear; year--) {
      years.push(year.toString());
    }
    return years;
  }, [currentYear]);

  // Fetch all data for the selected season
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      try {
        // Fetch driver standings
        const driversRes = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`
        );
        const driversData = await driversRes.json();
        const driversList = driversData?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
        
        const mappedDrivers = driversList.map((item) => ({
          id: item.Driver.driverId,
          name: `${item.Driver.givenName} ${item.Driver.familyName}`,
          team: item.Constructors[0]?.name || "Unknown",
          nationality: item.Driver.nationality,
          position: item.position,
          points: item.points,
          wins: item.wins,
        }));
        setDrivers(mappedDrivers);

        // Fetch constructor standings
        const teamsRes = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`
        );
        const teamsData = await teamsRes.json();
        const teamsList = teamsData?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
        
        const mappedTeams = teamsList.map((item) => ({
          id: item.Constructor.constructorId,
          name: item.Constructor.name,
          nationality: item.Constructor.nationality,
          position: item.position,
          points: item.points,
          wins: item.wins,
        }));
        setTeams(mappedTeams);

        // Fetch race schedule
        const racesRes = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}.json`
        );
        const racesData = await racesRes.json();
        const racesList = racesData?.MRData?.RaceTable?.Races || [];
        setRaces(racesList);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [season]);

  // Quick stats summary
  const getQuickStats = () => {
    if (!drivers.length || !teams.length) return null;

    const topDriver = drivers[0];
    const topTeam = teams[0];
    const totalRaces = races.length;

    return {
      leader: topDriver?.name || "N/A",
      leaderPoints: topDriver?.points || 0,
      topTeam: topTeam?.name || "N/A",
      topTeamPoints: topTeam?.points || 0,
      totalRaces,
      season
    };
  };

  const stats = getQuickStats();

  return (
    <div className="predictor-page">
      <div className="predictor-header">
        <h1>🏎️ F1 Predictor & Analyst</h1>
        <p>Get AI-powered insights and predictions</p>
        
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className="season-select"
        >
          {seasons.map((year) => (
            <option key={year} value={year}>
              {year} Season
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="predictor-loading">
          <div className="loader"></div>
          <p>Loading {season} data...</p>
        </div>
      ) : (
        <div className="predictor-content">
          {/* Quick Stats Panel */}
          <div className="stats-panel">
            <h2>📊 Quick Stats - {season}</h2>
            
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-label">Championship Leader</span>
                <span className="stat-value">{stats?.leader}</span>
                <span className="stat-sub">{stats?.leaderPoints} pts</span>
              </div>
              
              <div className="stat-card">
                <span className="stat-label">Top Constructor</span>
                <span className="stat-value">{stats?.topTeam}</span>
                <span className="stat-sub">{stats?.topTeamPoints} pts</span>
              </div>
              
              <div className="stat-card">
                <span className="stat-label">Total Races</span>
                <span className="stat-value">{stats?.totalRaces}</span>
                <span className="stat-sub">{season} season</span>
              </div>
            </div>

            {/* Top 5 Drivers */}
            <div className="standings-mini">
              <h3>🏆 Driver Standings</h3>
              <div className="standings-list">
                {drivers.slice(0, 5).map((driver, idx) => (
                  <div key={driver.id} className="standing-item">
                    <span className="position">P{idx + 1}</span>
                    <span className="name">{driver.name}</span>
                    <span className="team">{driver.team}</span>
                    <span className="points">{driver.points} pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 Teams */}
            <div className="standings-mini">
              <h3>🏭 Constructor Standings</h3>
              <div className="standings-list">
                {teams.slice(0, 5).map((team, idx) => (
                  <div key={team.id} className="standing-item">
                    <span className="position">P{idx + 1}</span>
                    <span className="name">{team.name}</span>
                    <span className="points">{team.points} pts</span>
                    <span className="wins">{team.wins} wins</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chatbot Panel */}
          <div className="chatbot-panel">
            <Chatbot 
              seasonData={races}
              driversData={drivers}
              teamsData={teams}
            />
          </div>
        </div>
      )}

      {/* Footer Tips */}
      <div className="predictor-tips">
        <h3>💡 Try asking:</h3>
        <ul>
          <li>"How many wins does Verstappen have?"</li>
          <li>"Who is leading the championship?"</li>
          <li>"Why is Red Bull so dominant?"</li>
          <li>"Compare Ferrari and McLaren performance"</li>
        </ul>
      </div>
    </div>
  );
}

export default Predictor;
