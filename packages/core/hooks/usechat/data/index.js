// packages/core/hooks/usechat/data/index.js
import { useState, useRef } from "react";

const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT || "/rag/chat"; // endpoint från Vite

export const useChatLogic = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const q = (inputRef.current?.value || "").trim();
    if (!q) return;

    // visa användarens fråga direkt
    setMessages((prev) => [...prev, { role: "user", text: q }]);
    inputRef.current.value = "";
    setLoading(true);

    try {
      // skicka fråga till API
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q }),
      });
      if (!res.ok) throw new Error(`HTTP_${res.status}`);

      const data = await res.json(); // { text, sources }
      const text = data?.text || "Ingen respons.";
      const sources = Array.isArray(data?.sources) ? data.sources : [];

      // visa svaret + källor
      setMessages((prev) => [...prev, { role: "assistant", text, sources }]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Tyvärr, något gick fel. Försök igen." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, handleSubmit, inputRef };
};
