function JuryVote({ addVote }) {
  return (
    <div className="jury-card">
      <h2>Jury Vote</h2>
      <p>Vote based on the strongest and fairest argument.</p>

      <div className="vote-buttons">
        <button onClick={() => addVote("prosecutor")}>
          Vote Prosecutor
        </button>

        <button onClick={() => addVote("defense")}>
          Vote Defense
        </button>

        <button onClick={() => addVote("fairSolution")}>
          Vote Fair Solution
        </button>
      </div>
    </div>
  )
}

export default JuryVote