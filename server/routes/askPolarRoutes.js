const express = require("express");
const {
  generateWithGemini,
} = require("../services/geminiService");
const Expedition = require("../models/Expedition");
const Publication = require("../models/Publication");
const Dataset = require("../models/Dataset");
const Activity = require("../models/Activity");

const router = express.Router();

const stopWords = new Set([
  "what",
  "which",
  "where",
  "when",
  "have",
  "has",
  "been",
  "were",
  "with",
  "from",
  "that",
  "this",
  "about",
  "into",
  "your",
  "research",
  "activities",
  "conducted",
  "tell",
  "please",
  "are",
  "the",
  "and",
  "for",
]);

function getKeywords(question) {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(
      (word) =>
        word.length > 2 && !stopWords.has(word)
    );
}

function scoreText(text, keywords) {
  const value = text.toLowerCase();

  return keywords.reduce(
    (score, keyword) =>
      score + (value.includes(keyword) ? 1 : 0),
    0
  );
}

router.post("/", async (req, res) => {
  try {
    const question = String(
      req.body.question || ""
    ).trim();

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Please enter a question",
      });
    }

    const [
      expeditions,
      publications,
      datasets,
      activities,
    ] = await Promise.all([
      Expedition.find({ published: true }).lean(),
      Publication.find({ published: true }).lean(),
      Dataset.find({ published: true }).lean(),
      Activity.find({ published: true }).lean(),
    ]);

    const keywords = getKeywords(question);

    const records = [
      ...expeditions.map((item) => ({
        id: item._id,
        type: "Expedition",
        title: item.name,
        text: `${item.name} ${item.location} ${item.description}`,
        description: item.description,
        url: `/expeditions/${item._id}`,
        sourceUrl: item.sourceUrl,
      })),

      ...publications.map((item) => ({
        id: item._id,
        type: "Publication",
        title: item.title,
        text: `${item.title} ${item.abstract} ${item.category} ${(item.authors || []).join(" ")}`,
        description: item.abstract,
        url: "/publications",
        sourceUrl:
          item.publicationUrl || item.sourceUrl,
      })),

      ...datasets.map((item) => ({
        id: item._id,
        type: "Dataset",
        title: item.name,
        text: `${item.name} ${item.description} ${item.category}`,
        description: item.description,
        url: "/datasets",
        sourceUrl:
          item.dataUrl || item.sourceUrl,
      })),

      ...activities.map((item) => ({
        id: item._id,
        type: "Activity",
        title: item.title,
        text: `${item.title} ${item.description} ${item.category}`,
        description: item.description,
        url: "/search",
        sourceUrl: item.sourceUrl,
      })),
    ];

    const ranked = records
      .map((record) => ({
        ...record,
        score: scoreText(record.text, keywords),
      }))
      .filter((record) => record.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    if (ranked.length === 0) {
      return res.json({
        success: true,
        grounded: false,
        answer:
          "I could not find sufficient information in the current Polar Knowledge Repository to answer this question. Try asking about a repository topic such as Antarctica, Arctic research, polar climate, oceanography or available datasets.",
        sources: [],
      });
    }

    const summaries = ranked
      .slice(0, 3)
      .map(
        (item) =>
          `${item.title}: ${item.description}`
      );
    
    let aiUsed = false;
    let answer;

try {
  const context = ranked
    .map(
      (item, index) =>
        `[${index + 1}] ${item.type}: ${item.title}\n${item.description}`
    )
    .join("\n\n");

  const prompt = `
You are the Polar Knowledge Assistant for an SIH prototype.

Answer the user's question ONLY from the repository context below.

Rules:
- Do not invent scientific facts.
- Do not add facts from general knowledge.
- If the repository context is insufficient, explicitly say so.
- Keep the answer clear and concise.
- Refer naturally to the available repository information.
- Do not claim that demo/sample metadata is verified scientific evidence.

USER QUESTION:
${question}

REPOSITORY CONTEXT:
${context}

Provide only the answer text.
`;

  answer = await generateWithGemini(prompt);
} catch (error) {
  console.error(
    "Gemini unavailable, using repository fallback:",
    error.message
  );
}

if (!answer) {
  answer =
    `Based on the available Polar Knowledge Repository, I found ${ranked.length} relevant record${ranked.length > 1 ? "s" : ""}. ` +
    summaries.join(" ");
}

    const sources = ranked.map((item) => ({
      id: item.id,
      type: item.type,
      title: item.title,
      url: item.url,
      sourceUrl: item.sourceUrl,
    }));

    return res.json({
      success: true,
      grounded: true,
      answer,
      sources,
      mode: answer
  ? "repository-grounded-ai"
  : "repository-grounded",
    });
  } catch (error) {
    console.error("Ask Polar error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to query the repository",
    });
  }
});

module.exports = router;