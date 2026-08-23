export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  login,
  error,
}) {
  return (
    <div className="loginPage">

      <div className="bgGlow"></div>

      <div className="loginCard">

        <h1>🚀 ARJ</h1>

        <p>
          Smart AI Career Platform
        </p>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <button onClick={login}>
          Login
        </button>

      </div>
    </div>
  );
}