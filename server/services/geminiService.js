const { GoogleGenerativeAI } = require("@google/generative-ai");

const hasGemini = () => Boolean(process.env.GEMINI_API_KEY);

const generateWithGemini = async (prompt) => {
  if (!hasGemini()) {
    return null;
  }

  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
  );

  const model = genAI.getGenerativeModel({
   model: "gemini-3.8-flash",
  });

  const result = await model.generateContent(prompt);

  return result.response.text();
};

module.exports = {
  hasGemini,
  generateWithGemini,
};