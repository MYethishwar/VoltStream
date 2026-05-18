import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import Draggable from "react-draggable";

export default function ChatWidget() {

  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `# Welcome to VoltBot ⚡

I can help you with:

- Energy analytics
- Billing questions
- Smart devices
- PDF knowledge base
- Power optimization tips`,
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  const [useRAG, setUseRAG] = useState(false);

  // TEMP PDF FEATURE DISABLED
  // const [tempPDFUploaded, setTempPDFUploaded] =
  // useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async () => {

    if (!input.trim() || loading) return;

    const userMessage = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setInput("");

    setLoading(true);

    try {

      let endpoint = "/api/v1/chat";

      // TEMP PDF FEATURE DISABLED
      // if (useRAG && tempPDFUploaded) {
      //   endpoint = "/api/v1/chat/temp";
      // }
      // else

      if (useRAG) {
        endpoint = "/api/v1/chat/rag";
      }

      const res = await fetch(
        `http://localhost:8000${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: userMessage,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      const botReply = useRAG
        ? data.response
        : data.reply;

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botReply,
          sources: data.sources || [],
        },
      ]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `# Connection Error

Could not connect to VoltBot backend.

Please check:

- FastAPI server is running
- Backend is on port 8000
- Internet connection`,
        },
      ]);

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // TEMP PDF UPLOAD FUNCTIONALITY DISABLED
  // =========================================================

  /*
  const uploadTempPDF = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {

      setLoading(true);

      const res = await fetch(
        "http://localhost:8000/api/v1/chat/temp/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      setTempPDFUploaded(true);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            `# PDF Ready ✅

You can now ask questions
about the uploaded document.`,
        },
      ]);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }
  };
  */

  const handleKeyDown = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>

      {isOpen && (

        <Draggable handle=".drag-handle">

          <div
            style={{
              ...styles.chatWindow,

              background: useRAG
                ? "linear-gradient(180deg, rgba(30,27,75,0.96), rgba(49,46,129,0.93))"
                : "rgba(15,23,42,0.82)",

              boxShadow: useRAG
                ? "0 0 55px rgba(168,85,247,0.22)"
                : "0 0 45px rgba(6,182,212,0.16)",
            }}
          >

            {/* HEADER */}
            <div
              className="drag-handle"
              style={{
                ...styles.header,
                cursor: "move",
              }}
            >

              <div style={styles.headerLeft}>

                <div style={styles.avatar}>
                  ⚡
                </div>

                <div>

                  <div style={styles.headerTitle}>
                    {useRAG
                      ? "VoltBot Intelligence"
                      : "VoltBot AI"}
                  </div>

                  <div
                    style={{
                      ...styles.headerStatus,
                      color: useRAG
                        ? "#c084fc"
                        : "#22d3ee",
                    }}
                  >

                    <span style={styles.statusDot} />

                    {useRAG
                      ? "Knowledge Base Active"
                      : "General Assistant"}

                  </div>

                </div>

              </div>

              {/* RIGHT SIDE */}
              <div style={styles.headerActions}>

                <span
                  style={{
                    ...styles.modeText,
                    color: useRAG
                      ? "#c084fc"
                      : "#22d3ee",
                  }}
                >
                  {useRAG ? "RAG" : "AI"}
                </span>

                {/* TOGGLE */}
                <div
                  style={{
                    ...styles.toggleSwitch,
                    background: useRAG
                      ? "#7c3aed"
                      : "#334155",
                  }}
                  onClick={() => setUseRAG(!useRAG)}
                >

                  <div
                    style={{
                      ...styles.toggleCircle,
                      transform: useRAG
                        ? "translateX(20px)"
                        : "translateX(0px)",
                    }}
                  />

                </div>

                {/* CLOSE */}
                <button
                  style={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                >
                  ✕
                </button>

              </div>

            </div>

            {/* MESSAGES */}
            <div style={styles.messages}>

              {messages.map((msg, i) => (

                <div key={i}>

                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        msg.role === "user"
                          ? "flex-end"
                          : "flex-start",

                      alignItems: "flex-end",

                      gap: "8px",
                    }}
                  >

                    {msg.role === "bot" && (
                      <div style={styles.botAvatar}>
                        ⚡
                      </div>
                    )}

                    <div
                      style={{
                        ...styles.bubble,

                        background:
                          msg.role === "user"
                            ? "linear-gradient(135deg, #06b6d4, #3b82f6)"
                            : "rgba(255,255,255,0.05)",

                        backdropFilter: "blur(12px)",

                        border:
                          msg.role === "bot"
                            ? "1px solid rgba(255,255,255,0.06)"
                            : "none",

                        borderRadius:
                          msg.role === "user"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",

                        borderLeft:
                          msg.sources?.length > 0
                            ? useRAG
                              ? "3px solid #c084fc"
                              : "3px solid #22d3ee"
                            : "none",
                      }}
                    >

                      <ReactMarkdown
  components={{

    h1: ({ node, ...props }) => (
      <h1
        style={{
          fontSize: "1.2rem",
          fontWeight: "700",
          marginBottom: "12px",
          color: "#ffffff",
          lineHeight: "1.5",
        }}
        {...props}
      />
    ),

    h2: ({ node, ...props }) => (
      <h2
        style={{
          fontSize: "1.05rem",
          fontWeight: "700",
          marginTop: "12px",
          marginBottom: "10px",
          color: "#ffffff",
          lineHeight: "1.5",
        }}
        {...props}
      />
    ),

    h3: ({ node, ...props }) => (
      <h3
        style={{
          fontSize: "0.95rem",
          fontWeight: "700",
          marginTop: "10px",
          marginBottom: "8px",
          color: "#ffffff",
        }}
        {...props}
      />
    ),

    p: ({ node, ...props }) => (
      <p
        style={{
          lineHeight: "1.8",
          marginBottom: "10px",
          color: "#f8fafc",
          fontSize: "0.9rem",
        }}
        {...props}
      />
    ),

    ul: ({ node, ...props }) => (
      <ul
        style={{
          paddingLeft: "20px",
          marginBottom: "12px",
          lineHeight: "1.7",
        }}
        {...props}
      />
    ),

    ol: ({ node, ...props }) => (
      <ol
        style={{
          paddingLeft: "20px",
          marginBottom: "12px",
          lineHeight: "1.7",
        }}
        {...props}
      />
    ),

    li: ({ node, ...props }) => (
      <li
        style={{
          marginBottom: "6px",
          color: "#e2e8f0",
        }}
        {...props}
      />
    ),

    strong: ({ node, ...props }) => (
      <strong
        style={{
          color: "#ffffff",
          fontWeight: "700",
        }}
        {...props}
      />
    ),

    code: ({ inline, children, ...props }) => (

      inline ? (

        <code
          style={{
            background: "rgba(255,255,255,0.08)",
            padding: "2px 6px",
            borderRadius: "6px",
            fontSize: "0.82rem",
            color: "#67e8f9",
          }}
          {...props}
        >
          {children}
        </code>

      ) : (

        <pre
          style={{
            background: "#0f172a",
            padding: "12px",
            borderRadius: "12px",
            overflowX: "auto",
            marginTop: "10px",
            marginBottom: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <code
            style={{
              color: "#e2e8f0",
              fontSize: "0.82rem",
            }}
          >
            {children}
          </code>
        </pre>

      )
    ),

  }}
>
  {msg.text}
</ReactMarkdown>

                    </div>

                  </div>

                </div>

              ))}

              {/* LOADING */}
              {loading && (

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                  }}
                >

                  <div style={styles.botAvatar}>
                    ⚡
                  </div>

                  <div
                    style={{
                      ...styles.bubble,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    Analyzing...
                  </div>

                </div>

              )}

              <div ref={bottomRef} />

            </div>

            {/* TEMP PDF FEATURE DISABLED */}

            {/*
            {useRAG && (

              <label
                style={{
                  color: "#c084fc",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  marginBottom: "8px",
                }}
              >

                📄 Upload Temporary PDF

                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={uploadTempPDF}
                />

              </label>

            )}
            */}

            <div style={styles.inputArea}>

              <input
                style={styles.input}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  useRAG
                    ? "Ask questions to RAG..."
                    : "Ask VoltBot..."
                }
                disabled={loading}
              />

              <button
                style={styles.sendBtn}
                onClick={sendMessage}
                disabled={loading}
              >
                ➤
              </button>

            </div>

          </div>

        </Draggable>

      )}

      {/* FLOATING BUTTON */}
      <div style={styles.bubbleWrapper}>

        {!isOpen && (

          <div style={styles.label}>

            <span style={styles.labelDot} />

            {useRAG
              ? "PDF Intelligence"
              : "Ask VoltBot"}

          </div>

        )}

        <button
          style={styles.bubble_btn}
          onClick={() => setIsOpen(!isOpen)}
        >
          ⚡
        </button>

      </div>

    </>
  );
}

// styles remain same

const styles = {

  chatWindow: {
    position: "fixed",
    bottom: "90px",
    right: "24px",
    width: "450px",
    height: "550px",
    borderRadius: "30px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(4, 156, 211, 0.88)",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
  },

  headerTitle: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: "0.95rem",
  },

  headerStatus: {
    fontSize: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },

  modeText: {
    fontSize: "0.72rem",
    fontWeight: "700",
  },

  toggleSwitch: {
    width: "42px",
    height: "22px",
    borderRadius: "999px",
    position: "relative",
    cursor: "pointer",
    padding: "2px",
    transition: "all 0.3s ease",
  },

  toggleCircle: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    transition: "all 0.3s ease",
  },

  closeBtn: {
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    fontSize: "1rem",
  },

  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  botAvatar: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.7rem",
    flexShrink: 0,
  },

  bubble: {
    maxWidth: "85%",
    padding: "12px 15px",
    color: "#f8fafc",
    fontSize: "0.88rem",
    lineHeight: "1.6",
    wordWrap: "break-word",
  },

  sourcesList: {
    marginTop: "8px",
    padding: "10px",
    background: "rgba(255,255,255,0.04)",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.06)",
  },

  sourceItem: {
    marginBottom: "10px",
    color: "#ffffff",
  },

  sourceDetail: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    marginTop: "2px",
  },

  inputArea: {
    display: "flex",
    gap: "8px",
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
  },

  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.05)",
    color: "#ffffff",
    outline: "none",
  },

  sendBtn: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "1rem",
  },

  bubble_btn: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    width: "58px",
    height: "58px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    border: "none",
    color: "#ffffff",
    fontSize: "1.4rem",
    cursor: "pointer",
    zIndex: 10000,
    boxShadow: "0 0 35px rgba(6,182,212,0.35)",
  },

  bubbleWrapper: {
    position: "relative",
  },

  label: {
    position: "fixed",
    bottom: "92px",
    right: "24px",
    background: "rgba(15,23,42,0.95)",
    padding: "8px 12px",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "0.8rem",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  labelDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#22d3ee",
  },

};

