function ScoreBoard({ votes }) {
  return (
    <div className="score-card">
      <h2>Score Board</h2>

      <div className="score-row">
        <span>Prosecutor</span>
        <strong>{votes.prosecutor}</strong>
      </div>

      <div className="score-row">
        <span>Defense</span>
        <strong>{votes.defense}</strong>
      </div>

      <div className="score-row">
        <span>Fair Solution</span>
        <strong>{votes.fairSolution}</strong>
      </div>
    </div>
  )
}

export default ScoreBoard