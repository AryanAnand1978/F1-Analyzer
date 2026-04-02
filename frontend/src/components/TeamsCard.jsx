import "../css/teams.css";

function TeamsCard({ team, isSelected, onSelect, disableCheckbox }) {
  return (
    <div className={`team-card ${isSelected ? "selected" : ""}`}>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        disabled={disableCheckbox}
        className="team-checkbox"
      />

      {/* Position Badge */}
      <div className="team-position">
        #{team.position}
      </div>

      {/* Team Info */}
      <h2 className="team-name">{team.name}</h2>
      <p className="team-nationality">{team.nationality}</p>

      {/* Stats */}
      <div className="team-stats">
        <div>
          <span>Points</span>
          <strong>{team.points}</strong>
        </div>

        <div>
          <span>Wins</span>
          <strong>{team.wins}</strong>
        </div>
      </div>

    </div>
  );
}

export default TeamsCard;