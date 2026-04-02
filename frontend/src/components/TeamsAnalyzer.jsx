import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Scatter,
} from "recharts";

function TeamsAnalyzer() {
  const [params] = useSearchParams();

  const season = params.get("season");
  const team1 = params.get("t1");
  const team2 = params.get("t2");

  const [stats1, setStats1] = useState(null);
  const [stats2, setStats2] = useState(null);
  const [raceData, setRaceData] = useState([]);
  const [extraStats, setExtraStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [graphData, setGraphData] = useState([]);
  const [winsMarkers, setWinsMarkers] = useState([]);
  const [dnfMarkers, setDnfMarkers] = useState([]);

  useEffect(() => {
    if (!team1 || !team2 || !season) return;

    const fetchAllResults = async () => {
      let allRaces = [];
      let offset = 0;
      const limit = 100;

      while (true) {
        const res = await fetch(
          `https://api.jolpi.ca/ergast/f1/${season}/results.json?limit=${limit}&offset=${offset}`
        );

        const data = await res.json();
        const races = data?.MRData?.RaceTable?.Races || [];

        if (races.length === 0) break;

        allRaces = [...allRaces, ...races];
        offset += limit;
      }

      return allRaces;
    };

    const fetchData = async () => {
      try {
        setLoading(true);

        const racesAll = await fetchAllResults();

        if (!racesAll.length) {
          setLoading(false);
          return;
        }

        let team1Stats = {
          name: team1,
          totalPoints: 0,
          wins: 0,
          podiums: 0,
        };

        let team2Stats = {
          name: team2,
          totalPoints: 0,
          wins: 0,
          podiums: 0,
        };

        let team1Positions = [];
        let team2Positions = [];
        let races = [];

        let graph = [];
        let wins = [];
        let dnfs = [];

        const getBestDriver = (drivers) => {
          if (!drivers.length) return null;
          return drivers.reduce((best, curr) =>
            parseInt(curr.position) < parseInt(best.position) ? curr : best
          );
        };

        for (let i = 0; i < racesAll.length; i++) {
          const results = racesAll[i]?.Results || [];

          const team1Drivers = results.filter(
            (r) => r.Constructor.constructorId === team1
          );

          const team2Drivers = results.filter(
            (r) => r.Constructor.constructorId === team2
          );

          const best1 = getBestDriver(team1Drivers);
          const best2 = getBestDriver(team2Drivers);

          const pos1 = best1 ? parseInt(best1.position) : "-";
          const pos2 = best2 ? parseInt(best2.position) : "-";

          const driver1 = best1 ? best1.Driver.familyName : "-";
          const driver2 = best2 ? best2.Driver.familyName : "-";

          const pts1 = team1Drivers.reduce(
            (s, d) => s + parseFloat(d.points || 0),
            0
          );

          const pts2 = team2Drivers.reduce(
            (s, d) => s + parseFloat(d.points || 0),
            0
          );

          // 📊 GRAPH (PER RACE)
          graph.push({
            race: i + 1,
            [team1]: pts1,
            [team2]: pts2,
          });

          // 🏁 WIN MARKERS
          if (pos1 === 1) wins.push({ race: i + 1, value: pts1 });
          if (pos2 === 1) wins.push({ race: i + 1, value: pts2 });

          // ❌ DNF MARKERS
          const isDnf1 = team1Drivers.some(
            (d) => !d.status.includes("Finished")
          );
          const isDnf2 = team2Drivers.some(
            (d) => !d.status.includes("Finished")
          );

          if (isDnf1) dnfs.push({ race: i + 1, value: pts1 });
          if (isDnf2) dnfs.push({ race: i + 1, value: pts2 });

          // 📊 STATS
          if (pos1 !== "-") team1Positions.push(pos1);
          if (pos2 !== "-") team2Positions.push(pos2);

          team1Stats.totalPoints += pts1;
          team2Stats.totalPoints += pts2;

          if (pos1 === 1) team1Stats.wins++;
          if (pos2 === 1) team2Stats.wins++;

          if (pos1 !== "-" && pos1 <= 3) team1Stats.podiums++;
          if (pos2 !== "-" && pos2 <= 3) team2Stats.podiums++;

          races.push({
            raceName: racesAll[i]?.raceName,
            team1Position: pos1,
            team2Position: pos2,
            team1Driver: driver1,
            team2Driver: driver2,
            team1Points: pts1,
            team2Points: pts2,
          });
        }

        const avg = (arr) =>
          arr.length
            ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
            : "-";

        const extra = {
          team1: {
            avgFinish: avg(team1Positions),
            top10: team1Positions.filter((p) => p <= 10).length,
          },
          team2: {
            avgFinish: avg(team2Positions),
            top10: team2Positions.filter((p) => p <= 10).length,
          },
        };

        setStats1(team1Stats);
        setStats2(team2Stats);
        setRaceData(races);
        setExtraStats(extra);

        setGraphData(graph);
        setWinsMarkers(wins);
        setDnfMarkers(dnfs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [team1, team2, season]);

  if (loading) return <h2 style={{ marginTop: "40px" }}>Loading...</h2>;

  if (!stats1 || !stats2)
    return <h2 style={{ marginTop: "40px" }}>No data available</h2>;

  return (
    <div className="analyzer-page">
      {/* HEADER */}
      <div className="analyzer-header">
        <h1>Team Analyzer</h1>
        <p>HEAD TO HEAD BATTLE</p>
      </div>

      {/* COMPARISON */}
      <div className="card comparison-card">
        <div className="driver-box">
          {stats1.name.replace("_", " ").toUpperCase()}
        </div>
        <div className="vs">VS</div>
        <div className="driver-box">
          {stats2.name.replace("_", " ").toUpperCase()}
        </div>
      </div>

      {/* METRICS */}
      <div className="card metrics-card">
        <h2>Season Metrics</h2>

        <div className="metric-row">
          <span>Points</span>
          <span>{stats1.totalPoints}</span>
          <span>{stats2.totalPoints}</span>
        </div>

        <div className="metric-row">
          <span>Wins</span>
          <span>{stats1.wins}</span>
          <span>{stats2.wins}</span>
        </div>

        <div className="metric-row">
          <span>Podiums</span>
          <span>{stats1.podiums}</span>
          <span>{stats2.podiums}</span>
        </div>

        <div className="metric-row">
          <span>Avg Finish</span>
          <span>{extraStats?.team1.avgFinish}</span>
          <span>{extraStats?.team2.avgFinish}</span>
        </div>

        <div className="metric-row">
          <span>Top 10</span>
          <span>{extraStats?.team1.top10}</span>
          <span>{extraStats?.team2.top10}</span>
        </div>
      </div>

      {/* 📊 GRAPH */}
      <div className="card graph-card">
        <h2>Points Per Race</h2>

        <LineChart width={900} height={400} data={graphData}>
          <XAxis dataKey="race" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Line type="linear" dataKey={team1} stroke="#e10600" />
          <Line type="linear" dataKey={team2} stroke="#00d2ff" />

          <Scatter data={winsMarkers} fill="gold" name="Wins" />
          <Scatter data={dnfMarkers} fill="white" name="DNFs" />
        </LineChart>
      </div>

      {/* TABLE */}
      <div className="card race-card">
        <h2>Race Comparison</h2>

        <table>
          <thead>
            <tr>
              <th>Race</th>
              <th>{stats1.name}</th>
              <th>{stats2.name}</th>
            </tr>
          </thead>

          <tbody>
            {raceData.map((race, i) => (
              <tr key={i}>
                <td>{race.raceName}</td>
                <td>
                  <strong>P{race.team1Position}</strong>
                  <br />
                  {race.team1Driver} ({race.team1Points} pts)
                </td>
                <td>
                  <strong>P{race.team2Position}</strong>
                  <br />
                  {race.team2Driver} ({race.team2Points} pts)
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VERDICT */}
      <div className="card verdict-card">
        <h2>Final Verdict</h2>
        <p>
          {stats1.totalPoints > stats2.totalPoints
            ? `${stats1.name} dominates the season`
            : `${stats2.name} comes out on top`}
        </p>
      </div>
    </div>
  );
}

export default TeamsAnalyzer;