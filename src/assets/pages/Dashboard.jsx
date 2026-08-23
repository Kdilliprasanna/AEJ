export default function Dashboard({
  getATS,
}) {
  return (
    <>
      <h1>Dashboard 📊</h1>

      <div className="grid">

        <div className="card">
          <h3>ATS Score</h3>

          <div className="big">
            {getATS()}%
          </div>
        </div>

        <div className="card">
          <h3>Eligible Roles</h3>

          <p>Frontend Developer</p>

          <p>React Developer</p>
        </div>

        <div className="card">
          <h3>Skill Gap</h3>

          <p>Node.js</p>

          <p>DSA</p>
        </div>

      </div>
    </>
  );
}