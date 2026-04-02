import { useSearchParams } from "react-router-dom";
import "../css/driverAnalyzer.css";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function DriverAnalyzer() {
  const [searchParams] = useSearchParams();

  const season = searchParams.get("season");
  const driver1 = searchParams.get("d1");
  const driver2 = searchParams.get("d2");

  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔄 Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res1 = await fetch(
          `http://localhost:5000/api/f1/${season}/drivers/${driver1}/results.json`
        );
        const res2 = await fetch(
          `http://localhost:5000/api/f1/${season}/drivers/${driver2}/results.json`
        );

        const json1 = await res1.json();
        const json2 = await res2.json();

        setData1(json1);
        setData2(json2);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (season && driver1 && driver2) fetchData();
  }, [season, driver1, driver2]);

  const races1 = data1?.MRData?.RaceTable?.Races || [];
  const races2 = data2?.MRData?.RaceTable?.Races || [];

  // 🧠 Metrics
  function calculateMetrics(races) {
    let totalPoints = 0,
      wins = 0,
      podiums = 0,
      totalFinish = 0,
      finishCount = 0,
      dnfs = 0;

    races.forEach((race) => {
      const r = race?.Results?.[0];
      if (!r) return;

      const pos = parseInt(r.position);
      const pts = parseFloat(r.points);
      const status = r.status;

      totalPoints += pts;
      if (pos === 1) wins++;
      if (pos <= 3) podiums++;

      if (status === "Finished" || status.includes("+")) {
        totalFinish += pos;
        finishCount++;
      } else dnfs++;
    });

    return {
      totalPoints,
      wins,
      podiums,
      avgFinish: finishCount
        ? (totalFinish / finishCount).toFixed(2)
        : 0,
      dnfs,
    };
  }

  const stats1 = calculateMetrics(races1);
  const stats2 = calculateMetrics(races2);

  // 🧠 Verdict
  function generateVerdict(s1, s2, d1, d2) {
    let v = [];

    const leader = s1.totalPoints > s2.totalPoints ? d1 : d2;
    const diff = Math.abs(s1.totalPoints - s2.totalPoints);

    if (diff > 50) v.push(`${leader} dominated the season.`);
    else v.push(`${leader} had an edge.`);

    if (s1.wins !== s2.wins) {
      v.push(`${s1.wins > s2.wins ? d1 : d2} had more wins.`);
    }

    if (s1.avgFinish !== s2.avgFinish) {
      v.push(`${s1.avgFinish < s2.avgFinish ? d1 : d2} was more consistent.`);
    }

    if (s1.dnfs !== s2.dnfs) {
      v.push(`${s1.dnfs < s2.dnfs ? d1 : d2} was more reliable.`);
    }

    return v.join(" ");
  }

  const verdict = generateVerdict(stats1, stats2, driver1, driver2);

  // 📊 Chart Data
  const minLength = Math.min(races1.length, races2.length);

  const chartData = Array.from({ length: minLength }, (_, i) => {
    const r1 = races1[i]?.Results?.[0];
    const r2 = races2[i]?.Results?.[0];

    return {
      round: races1[i]?.round,

      [driver1]: r1 ? parseFloat(r1.points) : 0,
      [driver2]: r2 ? parseFloat(r2.points) : 0,

      dnf1: r1 && r1.status !== "Finished" && !r1.status.includes("+"),
      dnf2: r2 && r2.status !== "Finished" && !r2.status.includes("+"),

      win1: r1 && r1.position === "1",
      win2: r2 && r2.position === "1",
    };
  });

  // 🎯 Custom Dot
  const CustomDot = (props) => {
    const { cx, cy, payload, dataKey } = props;

    const isDNF =
      dataKey === driver1 ? payload.dnf1 : payload.dnf2;

    const isWin =
      dataKey === driver1 ? payload.win1 : payload.win2;

    if (isDNF) return <circle cx={cx} cy={cy} r={5} fill="red" />;
    if (isWin) return <circle cx={cx} cy={cy} r={5} fill="gold" />;

    return null;
  };

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>{error}</h2>;

  return (
    <div className="analyzer-page">

      {/* HEADER */}
      <div className="analyzer-header">
        <h1>Driver Comparison</h1>
        <p>Season: {season}</p>
      </div>

      {/* COMPARISON */}
      <div className="card comparison-card">
        <div>{driver1}</div>
        <div>VS</div>
        <div>{driver2}</div>
      </div>

      {/* METRICS */}
      <div className="card metrics-card">
        <h2>Performance Metrics</h2>
        <p>Points: {stats1.totalPoints} vs {stats2.totalPoints}</p>
        <p>Wins: {stats1.wins} vs {stats2.wins}</p>
        <p>Podiums: {stats1.podiums} vs {stats2.podiums}</p>
        <p>Avg Finish: {stats1.avgFinish} vs {stats2.avgFinish}</p>
        <p>DNFs: {stats1.dnfs} vs {stats2.dnfs}</p>
      </div>

      {/* ✅ SUMMARY CARD (ADDED HERE) */}
      <div className="card summary-card">
        <h2>Season Insight</h2>

        <div className="summary-row">
          <span>🏆 Leader:</span>
          <span>
            {stats1.totalPoints > stats2.totalPoints ? driver1 : driver2}
          </span>
        </div>

        <div className="summary-row">
          <span>⚡ Most Wins:</span>
          <span>
            {stats1.wins > stats2.wins ? driver1 : driver2}
          </span>
        </div>

        <div className="summary-row">
          <span>📉 Most Consistent:</span>
          <span>
            {stats1.avgFinish < stats2.avgFinish ? driver1 : driver2}
          </span>
        </div>
      </div>

      {/* GRAPH */}
      <div className="card graph-card">
        <h2>Performance Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="round" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey={driver1}
              stroke="#007bff"
              dot={<CustomDot />}
            />

            <Line
              type="monotone"
              dataKey={driver2}
              stroke="#dc3545"
              dot={<CustomDot />}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* TABLE */}
      <div className="card race-card">
        <h2>Race-by-Race</h2>

        <table>
          <thead>
            <tr>
              <th>Race</th>
              <th>{driver1}</th>
              <th>{driver2}</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: minLength }).map((_, i) => {
              const r1 = races1[i]?.Results?.[0];
              const r2 = races2[i]?.Results?.[0];

              return (
                <tr key={i}>
                  <td>{races1[i]?.raceName}</td>
                  <td>{r1 ? r1.position : "-"}</td>
                  <td>{r2 ? r2.position : "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VERDICT */}
      <div className="card verdict-card">
        <h2>Overall Verdict</h2>
        <p>{verdict}</p>
      </div>

    </div>
  );
}

export default DriverAnalyzer;