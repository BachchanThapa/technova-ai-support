// packages/core/api/ingest/ingestFaq.js
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

const INPUT_DIR = path.resolve(process.cwd(), "uploadDocument"); // lägg .txt här

// --- Supabase (kräver Service Role nyckel för skrivning) ---
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error("[ingest] Saknar SUPABASE_URL eller SUPABASE_SERVICE_ROLE");
  process.exit(1);
}
const sb = createClient(url, key);

// --- Embeddings (måste vara en embeddings-modell) ---
const embeddings = new OllamaEmbeddings({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.EMBEDDING_MODEL || "nomic-embed-text",
});

// Läs alla .txt och returnera [{ text, title }]
async function readTxt(dir) {
  const files = (await fs.readdir(dir)).filter(f => f.toLowerCase().endsWith(".txt"));
  const docs = [];
  for (const f of files) {
    const text = await fs.readFile(path.join(dir, f), "utf8");
    const title = path.basename(f, path.extname(f)); // titel = filnamn utan ändelse
    docs.push({ text, title, file: f });
  }
  return docs;
}

async function run() {
  console.log("[ingest] Läser från:", INPUT_DIR);
  const inputs = await readTxt(INPUT_DIR);
  if (!inputs.length) return console.log("[ingest] Inga .txt-filer hittades");

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 700, chunkOverlap: 100 });

  // Skapa chunkade dokument med metadata { title, section?, source, chunk }
  const docs = [];
  for (const { text, title, file } of inputs) {
    const chunks = await splitter.splitText(text);
    chunks.forEach((pageContent, i) =>
      docs.push({
        pageContent,
        metadata: {
          title,            // används av UI-källor
          section: null,    // sätts ev. senare om du vill
          source: file,     // originalfil
          chunk: i,
        },
      })
    );
  }

  console.log(`[ingest] Upsertar ${docs.length} chunks...`);
  await SupabaseVectorStore.fromDocuments(docs, embeddings, {
    client: sb,
    tableName: process.env.RAG_TABLE || "documents",
  });
  console.log("[ingest] Klart");
}

run().catch(err => {
  console.error("[ingest] Fel:", err?.message || err);
  process.exit(1);
});
