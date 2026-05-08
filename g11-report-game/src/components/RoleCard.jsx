function RoleCard({ title, duty, argument }) {
  return (
    <div className="role-card">
      <h3>{title}</h3>
      <p className="duty">{duty}</p>

      <div className="argument-box">
        <h4>Suggested Argument</h4>
        <p>{argument}</p>
      </div>
    </div>
  )
}

export default RoleCard