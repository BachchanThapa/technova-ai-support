import { ChatOllama } from '@langchain/ollama';

export const llm = new ChatOllama({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.MODEL || "llama3.1:8b",
  temperature: 0.2,
});


/*

const BASE = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const MODEL = process.env.MODEL || 'llama3.1:8b';

export const llm = new ChatOllama({ baseUrl: BASE, mode: MODEL });
*/