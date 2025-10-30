import { qaChain } from "../lib/chain.js";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;
    const result = await qaChain.invoke({ question: message, chat_history: [] });
    // result is { text, sources }
    res.json(result);
  } catch (err) {
    console.error("[/rag/chat] error:", err?.message, err?.stack);
    res.status(500).json({ error: "chat_failed" });
  }
};
