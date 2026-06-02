import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import Draggable from "react-draggable";

const MODES = {
  AI: "ai",
  RAG: "rag",
  AGENT: "agent",
};

const MODE_CONFIG = {
  [MODES.AI]: {
    label: "AI",
    title: "VoltBot AI",
    status: "General Assistant",
    statusColor: "#38bdf8",
    accentFrom: "#0ea5e9",
    accentTo: "#6366f1",
    bg: "linear-gradient(160deg,#070b14 0%,#0b1220 60%,#0d1424 100%)",
    glow: "rgba(14,165,233,0.28)",
    messageBg: "rgba(59,130,246,0.04)",
    endpoint: "/api/v1/chat",
    replyKey: "reply",
    icon: "⚡",
    modeIcon: "🧠",
    placeholder: "Ask VoltBot anything...",
  },
  [MODES.RAG]: {
    label: "RAG",
    title: "VoltBot Intelligence",
    status: "Knowledge Base Active",
    statusColor: "#c084fc",
    accentFrom: "#9333ea",
    accentTo: "#ec4899",
    bg: "linear-gradient(160deg,#0d0818 0%,#140d24 60%,#180d28 100%)",
    glow: "rgba(168,85,247,0.28)",
    messageBg: "rgba(168,85,247,0.05)",
    endpoint: "/api/v1/chat/rag",
    replyKey: "response",
    icon: "🔍",
    modeIcon: "📚",
    placeholder: "Ask questions from PDFs...",
  },
  [MODES.AGENT]: {
    label: "AGENT",
    title: "VoltBot Agent",
    status: "Device Control Active",
    statusColor: "#4ade80",
    accentFrom: "#16a34a",
    accentTo: "#0d9488",
    bg: "linear-gradient(160deg,#07120c 0%,#081811 60%,#07120c 100%)",
    glow: "rgba(34,197,94,0.26)",
    messageBg: "rgba(0,255,120,0.04)",
    endpoint: "/api/v1/agent",
    replyKey: "reply",
    icon: "🤖",
    modeIcon: "⚙️",
    placeholder: 'e.g. "Turn off AC"',
  },
};

const makeInitialMessages = () => ({
  [MODES.AI]: [
    {
      role: "bot",
      text: `## Welcome to VoltBot ⚡\n\nYour AI-powered energy assistant.\n\n- Energy analytics\n- Billing insights\n- Smart recommendations\n- Power optimization`,
    },
  ],
  [MODES.RAG]: [
    {
      role: "bot",
      text: `## VoltBot Intelligence 🔍\n\nAnswers grounded in your uploaded documents.\n\n- Ask questions from PDFs\n- Get cited responses\n- Technical references`,
    },
  ],
  [MODES.AGENT]: [
    {
      role: "bot",
      text: `## VoltBot Agent 🤖\n\nI can control your smart devices.\n\n- "Turn off AC"\n- "Add bedroom fan"\n- "List devices"`,
    },
  ],
});

const glass = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(24px)",
};

const markdownStyles = {
  h1: { fontSize: "1.08rem", fontWeight: "700", marginBottom: "10px", color: "#ffffff", letterSpacing: "-0.03em" },
  h2: { fontSize: "1rem", fontWeight: "700", marginBottom: "8px", color: "#ffffff" },
  p: { color: "rgba(255,255,255,0.88)", fontSize: "0.92rem", lineHeight: "1.8", marginBottom: "8px" },
  li: { color: "#dbe4ee", fontSize: "0.9rem", lineHeight: "1.8", marginBottom: "4px" },
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState(MODES.AI);
  const [messagesByMode, setMessagesByMode] = useState(makeInitialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const cfg = MODE_CONFIG[mode];
  const messages = messagesByMode[mode];

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByMode, mode, loading]);

  // Focus input when widget opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, mode]);

  // ── FIX: reset messages to initial state every time the widget is opened
  // This prevents stale/ghost messages from previous sessions appearing
  const handleOpen = useCallback(() => {
    setIsOpen((prev) => {
      if (!prev) {
        // Reset all mode messages to clean welcome state on each open
        setMessagesByMode(makeInitialMessages());
        setInput("");
        setLoading(false);
      }
      return !prev;
    });
  }, []);

  const addMessage = useCallback((newMsg) => {
    setMessagesByMode((prev) => ({
      ...prev,
      [mode]: [...prev[mode], newMsg],
    }));
  }, [mode]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    addMessage({ role: "user", text: userMessage });
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("vs_token");

      const authHeaders = {
        "Content-Type": "application/json",
        ...(mode === MODES.AGENT && token
          ? { Authorization: `Bearer ${token}` }
          : {}),
      };

      const res = await fetch(`http://localhost:8000${cfg.endpoint}`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Error");
      }

      const botReply =
        data[cfg.replyKey] ||
        data.reply ||
        data.response ||
        "No response received.";

      addMessage({ role: "bot", text: botReply });

      if (mode === MODES.AGENT) {
        window.dispatchEvent(new CustomEvent("agent:device:updated"));
      }
    } catch (err) {
      addMessage({
        role: "bot",
        text: `## Connection Error\n\nCould not connect to VoltBot backend.\n\n\`${err.message}\``,
      });
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

  // ── FIX: switching mode resets input and stops any in-flight loading state
  const handleModeSwitch = (m) => {
    if (m === mode) return;
    setMode(m);
    setInput("");
    setLoading(false);
  };

  return (
    <>
      <style>{`
        .vb-widget *{ box-sizing:border-box; font-family:'Inter',sans-serif; -webkit-font-smoothing:antialiased; }
        .vb-scroll::-webkit-scrollbar{ width:4px; }
        .vb-scroll::-webkit-scrollbar-thumb{ background:rgba(255,255,255,0.1); border-radius:999px; }
        .vb-fab{ transition:all .2s ease; }
        .vb-fab:hover{ transform:translateY(-2px) scale(1.05); }
        .vb-send{ transition:all .18s ease; }
        .vb-send:hover{ transform:scale(1.05); }
        .vb-msg{ animation:fadeIn .25s ease; }
        @keyframes fadeIn{ from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .vb-dot{ animation:pulse 1.2s infinite ease-in-out; }
        .vb-dot:nth-child(2){ animation-delay:.15s; }
        .vb-dot:nth-child(3){ animation-delay:.3s; }
        @keyframes pulse{ 0%,80%,100%{opacity:.3;transform:scale(.7)} 40%{opacity:1;transform:scale(1)} }
      `}</style>

      {isOpen && (
        <Draggable handle=".vb-header">
          <div
            className="vb-widget"
            style={{
              position: "fixed",
              bottom: "95px",
              right: "24px",
              width: "455px",
              height: "675px",
              borderRadius: "28px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              zIndex: 9999,
              background: cfg.bg,
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: `1px solid ${cfg.accentFrom}55`,
              boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.03)",
            }}
          >
            {/* BACKGROUND GLOW */}
            <div style={{
              position: "absolute", inset: 0,
              background: `radial-gradient(circle at top right, ${cfg.glow}, transparent 40%)`,
              pointerEvents: "none",
            }} />

            {/* HEADER */}
            <div
              className="vb-header"
              style={{
                padding: "16px 18px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                background: `linear-gradient(135deg, ${cfg.accentFrom}22, rgba(10,15,25,0.82))`,
                backdropFilter: "blur(24px)",
                cursor: "move",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{
                    width: "38px", height: "38px", borderRadius: "12px",
                    background: `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", boxShadow: `0 10px 30px ${cfg.glow}`,
                  }}>
                    {cfg.icon}
                  </div>
                  <div>
                    <div style={{ color: "#ffffff", fontWeight: "700", fontSize: "1rem", letterSpacing: "-0.03em" }}>
                      {cfg.title}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px", color: cfg.statusColor, fontSize: "0.74rem", fontWeight: "600" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: cfg.statusColor }} />
                      {cfg.status}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleOpen}
                  style={{
                    width: "30px", height: "30px", borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#94a3b8", cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {/* MODES */}
              <div style={{ display: "flex", gap: "6px", marginTop: "14px" }}>
                {Object.values(MODES).map((m) => {
                  const mc = MODE_CONFIG[m];
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => handleModeSwitch(m)}
                      style={{
                        flex: 1, padding: "8px 0", borderRadius: "12px",
                        border: active ? `1px solid ${mc.statusColor}35` : "1px solid rgba(255,255,255,0.05)",
                        background: active
                          ? `linear-gradient(135deg, ${mc.accentFrom}25, ${mc.accentTo}15)`
                          : "rgba(255,255,255,0.03)",
                        color: active ? mc.statusColor : "rgba(255,255,255,0.42)",
                        fontSize: "0.76rem",
                        fontWeight: active ? "600" : "500",
                        cursor: "pointer",
                      }}
                    >
                      {mc.modeIcon} {mc.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MESSAGES */}
            <div
              className="vb-scroll"
              style={{
                flex: 1, overflowY: "auto", padding: "18px 16px",
                display: "flex", flexDirection: "column", gap: "14px", zIndex: 2,
              }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="vb-msg"
                  style={{
                    display: "flex",
                    flexDirection: msg.role === "user" ? "row-reverse" : "row",
                    gap: "10px",
                    alignItems: "flex-end",
                  }}
                >
                  {msg.role === "bot" && (
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "10px",
                      background: `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, fontSize: "0.72rem",
                    }}>
                      {cfg.icon}
                    </div>
                  )}
                  <div style={{
                    maxWidth: "82%", padding: "13px 15px",
                    borderRadius: msg.role === "user" ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
                    background: msg.role === "user"
                      ? `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})`
                      : cfg.messageBg,
                    border: msg.role === "user"
                      ? `1px solid ${cfg.accentTo}33`
                      : "1px solid rgba(255,255,255,0.05)",
                    boxShadow: msg.role === "user" ? `0 10px 28px ${cfg.glow}` : "none",
                    backdropFilter: "blur(24px)",
                  }}>
                    <ReactMarkdown
                      components={{
                        h1: ({ ...p }) => <h1 style={markdownStyles.h1} {...p} />,
                        h2: ({ ...p }) => <h2 style={markdownStyles.h2} {...p} />,
                        p: ({ ...p }) => <p style={markdownStyles.p} {...p} />,
                        ul: ({ ...p }) => <ul style={{ paddingLeft: "18px" }} {...p} />,
                        li: ({ ...p }) => <li style={markdownStyles.li} {...p} />,
                        strong: ({ ...p }) => <strong style={{ color: "#ffffff" }} {...p} />,
                        code: ({ inline, children, ...p }) =>
                          inline ? (
                            <code style={{
                              background: "rgba(255,255,255,0.08)",
                              padding: "2px 6px", borderRadius: "6px",
                              color: cfg.statusColor, fontSize: "0.82rem",
                            }} {...p}>{children}</code>
                          ) : (
                            <pre style={{ background: "rgba(0,0,0,0.35)", padding: "12px", borderRadius: "12px", overflowX: "auto" }}>
                              <code>{children}</code>
                            </pre>
                          ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}

              {/* LOADING DOTS */}
              {loading && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{
                    width: "30px", height: "30px", borderRadius: "10px",
                    background: `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem",
                  }}>
                    {cfg.icon}
                  </div>
                  <div style={{ ...glass, padding: "14px 16px", borderRadius: "18px 18px 18px 6px", display: "flex", gap: "5px" }}>
                    {[0, 1, 2].map((n) => (
                      <span key={n} className="vb-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.statusColor }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={{
              padding: "15px 16px 18px",
              borderTop: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(10,15,25,0.72)",
              backdropFilter: "blur(24px)",
              zIndex: 2,
            }}>
              <div style={{ ...glass, display: "flex", alignItems: "center", gap: "8px", borderRadius: "18px", padding: "5px 5px 5px 16px" }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={cfg.placeholder}
                  disabled={loading}
                  style={{ flex: 1, background: "transparent", border: "none", color: "#ffffff", fontSize: "0.95rem", outline: "none" }}
                />
                <button
                  className="vb-send"
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  style={{
                    width: "42px", height: "42px", borderRadius: "14px", border: "none",
                    background: input.trim()
                      ? `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})`
                      : "rgba(255,255,255,0.08)",
                    color: "#ffffff", fontSize: "0.82rem", cursor: "pointer",
                    boxShadow: input.trim() ? `0 10px 28px ${cfg.glow}` : "none",
                  }}
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </Draggable>
      )}

      {/* FAB */}
      <div style={{
        position: "fixed", right: "24px", bottom: "24px",
        zIndex: 10000, display: "flex", flexDirection: "column",
        alignItems: "flex-end", gap: "8px",
      }}>
        {!isOpen && (
          <div style={{
            ...glass, padding: "8px 13px", borderRadius: "14px",
            color: "#ffffff", fontSize: "0.8rem",
            display: "flex", alignItems: "center", gap: "7px",
          }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.statusColor }} />
            {mode === MODES.AGENT ? "Device Control" : mode === MODES.RAG ? "PDF Intelligence" : "Ask VoltBot"}
          </div>
        )}
        <button
          className="vb-fab"
          onClick={handleOpen}
          style={{
            width: "60px", height: "60px", borderRadius: "20px", border: "none",
            background: `linear-gradient(135deg, ${cfg.accentFrom}, ${cfg.accentTo})`,
            color: "#ffffff", fontSize: "1.4rem", cursor: "pointer",
            boxShadow: `0 14px 36px ${cfg.glow}, 0 0 0 1px rgba(255,255,255,0.08)`,
          }}
        >
          {cfg.icon}
        </button>
      </div>
    </>
  );
}