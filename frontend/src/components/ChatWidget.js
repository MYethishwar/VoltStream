import { useState, useRef, useEffect } from "react";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

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
          text: "⏳ VoltBot is at capacity. Please wait a moment and try again!",
        }]);
        return;
      }

      if (!res.ok) throw new Error(data.detail || "Something went wrong");
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
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
    <>
      {/* Chat Window */}
      {isOpen && (
        <div style={styles.chatWindow}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.avatar}>⚡</div>
              <div>
                <div style={styles.headerTitle}>VoltBot</div>
                <div style={styles.headerStatus}>
                  <span style={styles.statusDot} />
                  Online
                </div>
              </div>
            </div>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: "8px",
              }}>
                {msg.role === "bot" && (
                  <div style={styles.botAvatar}>⚡</div>
                )}
                <div style={{
                  ...styles.bubble,
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                    : "#1e293b",
                  borderRadius: msg.role === "user"
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: "8px" }}>
                <div style={styles.botAvatar}>⚡</div>
                <div style={{ ...styles.bubble, background: "#1e293b" }}>
                  <div style={styles.typingDots}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={styles.inputArea}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask VoltBot..."
              disabled={loading}
            />
            <button
              style={{
                ...styles.sendBtn,
                opacity: loading || !input.trim() ? 0.4 : 1,
                cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              }}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}

{/* Floating Bubble */}
<div style={styles.bubbleWrapper}>
  {/* Animated label */}
  {!isOpen && (
    <div style={styles.label}>
      <span style={styles.labelDot} />
      Ask VoltBot
    </div>
  )}

  {/* Bubble button */}
  <button style={styles.bubble_btn} onClick={() => setIsOpen((prev) => !prev)}>
    {isOpen ? "✕" : "⚡"}
    {!isOpen && messages.length > 1 && (
      <span style={styles.badge}>
        {messages.filter(m => m.role === "bot").length - 1}
      </span>
    )}
  </button>
</div>
      {/* Typing animation CSS */}
      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
        .typing-dot {
          width: 7px; height: 7px;
          background: #64748b;
          border-radius: 50%;
          display: inline-block;
          animation: blink 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </>
  );
}

const styles = {
  chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "360px",
    height: "500px",
    backgroundColor: "#0f172a",
    borderRadius: "20px",
    boxShadow: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(6,182,212,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
    animation: "slideUp 0.25s ease",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    borderBottom: "1px solid rgba(6,182,212,0.15)",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },
  headerTitle: {
    color: "#f1f5f9",
    fontWeight: "700",
    fontSize: "0.95rem",
  },
  headerStatus: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#22d3ee",
    fontSize: "0.72rem",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#22d3ee",
    display: "inline-block",
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "1rem",
    cursor: "pointer",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  botAvatar: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    flexShrink: 0,
  },
  bubble: {
    maxWidth: "80%",
    padding: "10px 14px",
    color: "#f1f5f9",
    fontSize: "0.88rem",
    lineHeight: "1.5",
  },
  typingDots: {
    display: "flex",
    gap: "4px",
    padding: "2px 0",
  },
  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid rgba(6,182,212,0.1)",
    backgroundColor: "#0f172a",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "12px",
    border: "1px solid #1e293b",
    backgroundColor: "#1e293b",
    color: "#f1f5f9",
    fontSize: "0.88rem",
    outline: "none",
  },
  sendBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    border: "none",
    color: "#fff",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "opacity 0.2s",
  },
  bubble_btn: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    border: "none",
    color: "#fff",
    fontSize: "1.4rem",
    cursor: "pointer",
    boxShadow: "0 8px 32px rgba(6,182,212,0.4)",
    zIndex: 10000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s",
  },
  
  badge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "0.65rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
  },
};