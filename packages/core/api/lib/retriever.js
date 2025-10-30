// packages/core/api/lib/retriever.js
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OllamaEmbeddings } from "@langchain/ollama";

// Krävs för att koppla mot Supabase
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE;
if (!url || !key) throw new Error("Saknar SUPABASE_URL eller SUPABASE_SERVICE_ROLE");

// Embeddings via Ollama (lokal modell)
const embeddings = new OllamaEmbeddings({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.EMBEDDING_MODEL || "nomic-embed-text",
});

// Vector store mot Supabase-tabell + RPC
const store = new SupabaseVectorStore(embeddings, {
  client: createClient(url, key),
  tableName: process.env.RAG_TABLE || "documents",
  queryName: process.env.RAG_MATCH_RPC || "match_documents",
});

// Exponera som LangChain-retriever
export const retriever = store.asRetriever();
