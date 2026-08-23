export default function Sidebar({
  setPage,
  setLoggedIn,
}) {
  return (
    <div className="sidebar">

      <div>

        <h2>🚀 ARJ</h2>

        <button
          onClick={() =>
            setPage("dashboard")
          }
        >
          📊 Dashboard
        </button>

        <button
          onClick={() =>
            setPage("ats")
          }
        >
          📄 ATS
        </button>

        <button
          onClick={() =>
            setPage("jobs")
          }
        >
          💼 Jobs
        </button>

        <button
          onClick={() =>
            setPage("chat")
          }
        >
          🤖 AI Chat
        </button>

      </div>

      <button
        className="logout"
        onClick={() =>
          setLoggedIn(false)
        }
      >
        🚪 Logout
      </button>

    </div>
  );
}