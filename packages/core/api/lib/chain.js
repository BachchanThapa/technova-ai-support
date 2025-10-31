// Enkel QA-kedja utan onödig komplexitet: fråga → hämta docs → svara → källor

import { StringOutputParser } from "@langchain/core/output_parsers";
import { retriever } from "./retriever.js";
import { standaloneQuestionTemplate, answerTemplate } from "./templates.js";
import { llm } from "./llm.js";

// 1) Gör om kontextberoende fråga till fristående fråga
const standaloneQuestionChain = standaloneQuestionTemplate
  .pipe(llm)
  .pipe(new StringOutputParser());

// 2) Skapa svar utifrån (context, question, chat_history)
const answerChain = answerTemplate
  .pipe(llm)
  .pipe(new StringOutputParser());

// Hjälp: forma ett dokument till källobjekt för UI
function toSource(doc) {
  const md = doc?.metadata || {};
  return {
    title: md.title || "TechNova FAQ",
    section: md.section ?? null,
    lines:
      Number.isFinite(md.line_start) && Number.isFinite(md.line_end)
        ? [md.line_start, md.line_end]
        : null,
    snippet: (doc?.pageContent || "").slice(0, 240),
  };
}

export const qaChain = {
  // question: användarens fråga, chat_history: ev. tidigare dialog
  async invoke({ question, chat_history = [] }) {
    // Gör först en fristående fråga (enklare för retrieval)
    const standalone = await standaloneQuestionChain.invoke({ question, chat_history });

    // Hämta relevanta dokument
    const docs = await retriever.invoke(standalone);
    const hasDocs = Array.isArray(docs) && docs.length > 0;

    // Bygg kontextsträng av träffarna
    const context = hasDocs ? docs.map(d => d.pageContent).join("\n\n") : "";

    // Svara (fallback om inga dokument finns)
    const text = hasDocs
      ? await answerChain.invoke({ context, question, chat_history })
      : "Jag kan bara svara på frågor som finns i TechNovas FAQ/policydokument. Försök gärna omformulera frågan eller ställ något om leverans, returer, garanti, betalning m.m.";

    // Plocka ut max 3 källor för UI
    const sources = (hasDocs ? docs.slice(0, 3) : []).map(toSource);

    return { text, sources };
  },
};
