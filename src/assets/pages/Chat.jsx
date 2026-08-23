export default function Chat({
  messages,
  input,
  setInput,
  sendMessage,
  loading,
}) {
  return (
    <>
      <h1>
        AI Career Chat 🤖
      </h1>

      <div className="chatBox">

        {messages.map(
          (msg, index) => (
            <div
              key={index}
              className={
                msg.role ===
                "user"
                  ? "userMsg"
                  : "aiMsg"
              }
            >
              {msg.text}
            </div>
          )
        )}

        {loading && (
          <div className="typing">
            AI Typing...
          </div>
        )}

      </div>

      <div className="chatInput">

        <input
          value={input}
          onChange={(e) =>
            setInput(
              e.target.value
            )
          }
          placeholder="Ask about jobs, ATS, interviews..."
        />

        <button
          onClick={sendMessage}
        >
          Send
        </button>

      </div>
    </>
  );
}