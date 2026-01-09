import { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(userMessage) {
    const res = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    return res.json();
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    // add user message
    setMessages(prev => [
      ...prev,
      { role: "user", text: input }
    ]);

    setLoading(true);

    try {
      const data = await sendMessage(input);

      // add bot message
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: data.reply || "No response received.",
          risk: data.risk
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          text: "⚠️ Something went wrong. Please try again."
        }
      ]);
    }

    setInput("");
    setLoading(false);
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        ONOE Chat Assistant
      </h2>

      <div className="space-y-3 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "bot"
                ? "bg-gray-100 p-3 rounded"
                : "bg-blue-100 p-3 rounded text-right"
            }
          >
            <p>{m.text}</p>
            {m.risk && (
              <small className="text-gray-500 block mt-1">
                {m.risk}
              </small>
            )}
          </div>
        ))}

        {loading && (
          <div className="bg-gray-100 p-3 rounded text-gray-500">
            AI is thinking...
          </div>
        )}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && handleSend()}
        className="border p-2 w-full rounded"
        placeholder="Ask about One Nation One Election..."
      />

      <button
        onClick={handleSend}
        disabled={loading}
        className="mt-2 bg-black text-white px-4 py-2 rounded w-full"
      >
        Send
      </button>
    </div>
  );
}


