import React from 'react'

function DriversCard({ driver, isSelected, onSelect, disableCheckbox }) {
  return (
    <div className={`driver-card ${isSelected ? "selected" : ""}`}>

      <div className="driver-card-top">
        <div>
          <h2>{driver.name}</h2>
          <p className="team">{driver.team}</p>
          <p className="nationality">{driver.nationality}</p>
        </div>

        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          disabled={disableCheckbox}
        />
      </div>

      <div className="driver-stats">
        <p>Position <span>{driver.position}</span></p>
        <p>Points <span>{driver.points}</span></p>
        <p>Wins <span>{driver.wins}</span></p>
        <p>Podiums <span>{driver.podiums}</span></p>
      </div>

    </div>
  );
}

export default DriversCard;
