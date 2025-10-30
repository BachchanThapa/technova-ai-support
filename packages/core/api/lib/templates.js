// packages/core/api/lib/templates.js
import {
  PromptTemplate,
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

// 1) Gör om till fristående fråga (enklare retrieval)
export const standaloneQuestionTemplate = PromptTemplate.fromTemplate(
  `Skriv om användarens fråga till en fristående, tydlig fråga.
Fråga: {question}
Fristående fråga:`
);

// 2) Svarsprompt som använder kontext + (ev.) chatthistorik
export const answerTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    `Du är TechNovas kundtjänstbot och svarar kort på svenska.
Använd endast KONTEKSTEN. Saknas fakta: säg kort att infon inte finns i dokumenten.`,
  ],
  new MessagesPlaceholder("chat_history"),
  [
    "user",
    `KONTEXT:
{context}

FRÅGA: {question}

Svara kort och tydligt:`,
  ],
]);
