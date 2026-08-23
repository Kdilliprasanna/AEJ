export default function ATS({
  getATS,
}) {
  return (
    <>
      <h1>
        ATS Analyzer 📄
      </h1>

      <div className="atsCircle">
        {getATS()}%
      </div>

      <div className="card">

        {getATS() < 60 &&
          "❌ Resume Weak"}

        {getATS() >= 60 &&
          getATS() < 80 &&
          "⚠️ Resume Medium"}

        {getATS() >= 80 &&
          "🔥 Resume Strong"}

      </div>
    </>
  );
}