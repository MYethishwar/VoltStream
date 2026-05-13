import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! I'm VoltBot ⚡ Ask me anything about your energy usage, billing, or devices!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (res.status === 429) {
        setMessages((prev) => [...prev, {
          role: "bot",
          text: "⏳ VoltBot is temporarily at capacity. Please wait a moment and try again!",
        }]);
        return;
      }

      if (!res.ok) throw new Error(data.detail || "Something went wrong");

      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, {
        role: "bot",
        text: "⚠️ Could not reach VoltBot. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <span style={styles.headerIcon}>⚡</span>
        <div>
          <div style={styles.headerTitle}>VoltBot</div>
          <div style={styles.headerSub}>Your AI Energy Assistant</div>
        </div>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
          }}>
            {msg.role === "bot" && <div style={styles.botAvatar}>⚡</div>}
            <div style={{
              ...styles.bubble,
              backgroundColor: msg.role === "user" ? "#4f46e5" : "#1e293b",
              borderRadius: msg.role === "user"
                ? "18px 18px 4px 18px"
                : "18px 18px 18px 4px",
            }}>
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={styles.botAvatar}>⚡</div>
            <div style={{ ...styles.bubble, backgroundColor: "#1e293b", color: "#64748b" }}>
              VoltBot is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about energy saving, billing, devices..."
          disabled={loading}
        />
        <button
          style={{
            ...styles.button,
            opacity: loading || !input.trim() ? 0.5 : 1,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
          }}
          onClick={sendMessage}
          disabled={loading || !input.trim()}
        >
          Send ➤
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 64px)",
    maxWidth: "860px",
    margin: "0 auto",
    padding: "1.5rem",
    backgroundColor: "#0f172a",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1rem",
    paddingBottom: "1rem",
    borderBottom: "1px solid #1e293b",
  },
  headerIcon: {
    fontSize: "2rem",
    backgroundColor: "#1e293b",
    padding: "10px",
    borderRadius: "12px",
  },
  headerTitle: {
    fontSize: "1.2rem",
    fontWeight: "700",
    color: "#f1f5f9",
  },
  headerSub: {
    fontSize: "0.8rem",
    color: "#64748b",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem 0",
  },
  botAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    flexShrink: 0,
    marginRight: "8px",
    alignSelf: "flex-end",
  },
  bubble: {
    maxWidth: "70%",
    padding: "0.75rem 1rem",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  inputRow: {
    display: "flex",
    gap: "0.75rem",
    paddingTop: "1rem",
    borderTop: "1px solid #1e293b",
  },
  input: {
    flex: 1,
    padding: "0.85rem 1.2rem",
    borderRadius: "10px",
    border: "1px solid #334155",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    fontSize: "0.95rem",
    outline: "none",
  },
  button: {
    padding: "0.85rem 1.5rem",
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    fontSize: "0.95rem",
  },
};