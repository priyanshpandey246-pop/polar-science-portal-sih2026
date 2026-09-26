const Expedition = require("../models/Expedition");
const Publication = require("../models/Publication");
const Activity = require("../models/Activity");
const OutreachContent = require("../models/OutreachContent");

const {
  generateWithGemini,
} = require("../services/geminiService");

const getSource = async (sourceType, sourceId) => {
  if (sourceType === "expedition") {
    return Expedition.findById(sourceId);
  }

  if (sourceType === "publication") {
    return Publication.findById(sourceId);
  }

  if (sourceType === "activity") {
    return Activity.findById(sourceId);
  }

  return null;
};

const normalizeSource = (type, source) => {
  if (type === "expedition") {
    return {
      title: source.name,
      description: source.description,
      meta: `${source.location} • ${source.year}`,
      category: "Polar Expedition",
    };
  }

  if (type === "publication") {
    return {
      title: source.title,
      description: source.abstract,
      meta: `${source.category} • ${source.year}`,
      category: "Research Publication",
    };
  }

  return {
    title: source.title,
    description: source.description,
    meta: `${source.category} • ${
      source.date
        ? new Date(source.date).toLocaleDateString("en-IN")
        : ""
    }`,
    category: "Institutional Activity",
  };
};

// Reliable fallback if Gemini is unavailable
const generateDrafts = (record) => {
  const title = record.title;
  const description = record.description;
  const meta = record.meta;

  return {
    websiteSummary:
      `${title} is part of the Polar Knowledge Repository. ` +
      `${description} ${meta ? `Record context: ${meta}.` : ""}`,

    linkedinPost:
      `Polar Science Update | ${title}\n\n` +
      `${description}\n\n` +
      `Explore verified repository information through the Polar Knowledge Portal.\n\n` +
      `#PolarScience #Research #ScienceOutreach`,

    instagramCaption:
      `❄️ ${title}\n\n` +
      `${description}\n\n` +
      `Discover more through the Polar Knowledge Portal.\n\n` +
      `#PolarScience #PolarResearch #ScienceCommunication`,

    xPost:
      `${title}: ${description} #PolarScience`.slice(0, 280),

    announcement:
      `New repository update: ${title}. ${description}`.slice(
        0,
        400
      ),
  };
};

// Gemini grounded generator
const generateAIDrafts = async (record) => {
  const prompt = `
You are a science outreach content assistant for a Polar Science Knowledge Repository.

Generate outreach content ONLY from the repository record below.

STRICT RULES:
- Do not invent scientific facts.
- Do not introduce statistics, discoveries, locations, institutions or claims not present in the record.
- Treat demo/sample metadata as demonstration information, not verified scientific evidence.
- Use a professional scientific/institutional tone.
- Do not claim official government endorsement.
- Return ONLY valid JSON.
- Do not use markdown code fences.

REPOSITORY RECORD

Title:
${record.title}

Type:
${record.category}

Context:
${record.meta}

Description:
${record.description}

Return exactly these JSON fields:

{
  "websiteSummary": "80-120 word professional website summary",
  "linkedinPost": "Professional LinkedIn post with suitable hashtags",
  "instagramCaption": "Accessible Instagram caption with suitable hashtags",
  "xPost": "X post under 280 characters",
  "announcement": "Short institutional announcement"
}
`;

  const response = await generateWithGemini(prompt);

  if (!response) {
    return null;
  }

  const cleaned = response
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  const requiredFields = [
    "websiteSummary",
    "linkedinPost",
    "instagramCaption",
    "xPost",
    "announcement",
  ];

  const valid = requiredFields.every(
    (field) =>
      typeof parsed[field] === "string" &&
      parsed[field].trim().length > 0
  );

  if (!valid) {
    throw new Error(
      "Gemini returned an invalid outreach structure"
    );
  }

  parsed.xPost = parsed.xPost.slice(0, 280);

  return parsed;
};

const generateOutreach = async (req, res) => {
  try {
    const { sourceType, sourceId } = req.body;

    if (!sourceType || !sourceId) {
      return res.status(400).json({
        success: false,
        message:
          "Source type and source record are required",
      });
    }

    if (
      !["expedition", "publication", "activity"].includes(
        sourceType
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid source type",
      });
    }

    const source = await getSource(
      sourceType,
      sourceId
    );

    if (!source) {
      return res.status(404).json({
        success: false,
        message: "Repository source not found",
      });
    }

    const normalized = normalizeSource(
      sourceType,
      source
    );

    let drafts = null;
    let generationMode = "template-fallback";

    try {
      const aiDrafts =
        await generateAIDrafts(normalized);

      if (aiDrafts) {
        drafts = aiDrafts;
        generationMode = "gemini-grounded";

        console.log(
          "✅ Outreach: Gemini generation used"
        );
      }
    } catch (error) {
      console.error(
        "Gemini outreach unavailable, using fallback:",
        error.message
      );
    }

    if (!drafts) {
      drafts = generateDrafts(normalized);

      console.log(
        "ℹ️ Outreach: template fallback used"
      );
    }

    const outreach =
      await OutreachContent.create({
        sourceType,
        sourceId,
        sourceTitle: normalized.title,
        ...drafts,
        generationMode,
        status: "draft",
        createdBy: req.user._id,
      });

    return res.status(201).json({
      success: true,
      message: "Outreach draft generated",
      data: outreach,
    });
  } catch (error) {
    console.error(
      "Generate outreach error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to generate outreach content",
    });
  }
};

const updateOutreach = async (req, res) => {
  try {
    // Only editable content fields are accepted
    const allowedFields = [
      "websiteSummary",
      "linkedinPost",
      "instagramCaption",
      "xPost",
      "announcement",
    ];

    const update = {};

    allowedFields.forEach((field) => {
      if (
        typeof req.body[field] === "string"
      ) {
        update[field] = req.body[field];
      }
    });

    if (update.xPost) {
      update.xPost = update.xPost.slice(
        0,
        280
      );
    }

    const outreach =
      await OutreachContent.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!outreach) {
      return res.status(404).json({
        success: false,
        message:
          "Outreach content not found",
      });
    }

    return res.json({
      success: true,
      message: "Outreach content saved",
      data: outreach,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const changeStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (
      ![
        "draft",
        "approved",
        "published",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid outreach status",
      });
    }

    const update = {
      status,
    };

    if (status === "published") {
      update.publishedAt = new Date();
    }

    const outreach =
      await OutreachContent.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!outreach) {
      return res.status(404).json({
        success: false,
        message:
          "Outreach content not found",
      });
    }

    return res.json({
      success: true,
      message: `Content marked as ${status}`,
      data: outreach,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to update outreach status",
    });
  }
};

const getOutreach = async (req, res) => {
  try {
    const data = await OutreachContent.find({})
      .sort({
        createdAt: -1,
      })
      .limit(50);

    return res.json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        "Unable to load outreach content",
    });
  }
};

module.exports = {
  generateOutreach,
  updateOutreach,
  changeStatus,
  getOutreach,
};