/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState } from "react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to UI
    setMessages((prev) => [...prev, { sender: "user", text: message }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages, // 👈 send conversation history to backend
        }),
      });

      const data = await res.json();
      console.log("Server reply:", data);

      // Add Gemini reply (just reply text, not JSON.stringify)
      setMessages((prev) => [...prev, { sender: "ai", text: data.reply || "No reply" }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [...prev, { sender: "ai", text: "⚠️ Error getting response" }]);
    }

    setMessage(""); // Clear input
  };

  const clearChat = () => setMessages([]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Welcome To Sekhar's AI Chat</h2>

      <button
        onClick={clearChat}
        style={{
          marginBottom: "10px",
          padding: "6px 12px",
          background: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Clear Chat
      </button>

      {/* Chat area */}
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
          background: "#fafafa",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                padding: "10px",
                borderRadius: "10px",
                background: msg.sender === "user" ? "#007bff" : "#e5e5ea",
                color: msg.sender === "user" ? "white" : "black",
                maxWidth: "70%",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

