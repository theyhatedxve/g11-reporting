function CaseCard({ selectedCase }) {
  return (
    <section className="case-card">
      <p className="label">{selectedCase.topic}</p>
      <h2>{selectedCase.title}</h2>

      <div className="case-box">
        <h4>Situation</h4>
        <p>{selectedCase.situation}</p>
      </div>

      <div className="case-box">
        <h4>Court Question</h4>
        <p>{selectedCase.question}</p>
      </div>
    </section>
  )
}

export default CaseCard