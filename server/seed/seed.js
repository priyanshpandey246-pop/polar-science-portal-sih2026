const dotenv = require("dotenv");
const mongoose = require("mongoose");

const Expedition = require("../models/Expedition");
const Publication = require("../models/Publication");
const Dataset = require("../models/Dataset");
const Photo = require("../models/Photo");
const Video = require("../models/Video");
const Activity = require("../models/Activity");

dotenv.config();

const NCPOR = "https://ncpor.res.in/";

const expeditions = [
  {
    name: "Indian Antarctic Expedition – Demo Repository Record",
    year: 2025,
    location: "Antarctica",
    description:
      "Demo metadata representing India's Antarctic research programme. This record demonstrates expedition discovery, documentation and repository linking.",
    reportUrl: NCPOR,
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    featured: true,
    published: true,
  },
  {
    name: "Indian Arctic Research Programme – Demo Record",
    year: 2025,
    location: "Arctic",
    description:
      "Demo metadata representing Indian scientific activities in the Arctic and demonstrating centralized research discovery.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    featured: true,
    published: true,
  },
  {
    name: "Southern Ocean Research Expedition – Demo Record",
    year: 2024,
    location: "Southern Ocean",
    description:
      "Demo repository metadata illustrating the archival of Southern Ocean research and observation activities.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    featured: true,
    published: true,
  },
  {
    name: "Antarctic Environmental Monitoring – Demo Record",
    year: 2024,
    location: "Antarctica",
    description:
      "Demonstration metadata for environmental monitoring information associated with polar scientific research.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Polar Cryosphere Studies – Demo Record",
    year: 2023,
    location: "Polar Regions",
    description:
      "Demo metadata showing how information related to cryosphere studies can be indexed in the integrated repository.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Antarctic Atmospheric Observation – Demo Record",
    year: 2023,
    location: "Antarctica",
    description:
      "Demonstration repository record for atmospheric observation information in a polar research context.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Arctic Environmental Studies – Demo Record",
    year: 2022,
    location: "Arctic",
    description:
      "Demo metadata illustrating repository support for multidisciplinary Arctic environmental research.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Southern Ocean Observation – Demo Record",
    year: 2022,
    location: "Southern Ocean",
    description:
      "Demonstration metadata for scientific observations associated with the Southern Ocean.",
    sourceName: "National Centre for Polar and Ocean Research",
    sourceUrl: NCPOR,
    published: true,
  },
];

const publications = [
  {
    title: "Antarctic Climate Research – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2025,
    abstract:
      "Demo metadata representing research information associated with Antarctic climate studies.",
    category: "Climate Science",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Southern Ocean Research – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2025,
    abstract:
      "Demonstration publication metadata related to Southern Ocean scientific research.",
    category: "Oceanography",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Cryosphere Studies – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2024,
    abstract:
      "Sample publication metadata demonstrating discovery of cryosphere-related research through the portal.",
    category: "Cryosphere",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Arctic Environmental Research – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2024,
    abstract:
      "Demo metadata illustrating how Arctic environmental research publications can be indexed.",
    category: "Arctic Science",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Atmospheric Science – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2024,
    abstract:
      "Demonstration publication record associated with atmospheric science in polar regions.",
    category: "Atmospheric Science",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Antarctic Environmental Observations – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2023,
    abstract:
      "Sample metadata representing Antarctic environmental observation research.",
    category: "Environmental Science",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Ocean Processes – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2023,
    abstract:
      "Demo repository entry illustrating scientific publication discovery for polar ocean processes.",
    category: "Ocean Science",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Snow and Ice Research – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2022,
    abstract:
      "Demonstration metadata for scientific work associated with snow and ice research.",
    category: "Cryosphere",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Meteorology – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2022,
    abstract:
      "Sample metadata demonstrating publication management for polar meteorological research.",
    category: "Meteorology",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Integrated Polar Science – Demo Publication",
    authors: ["Demo Repository Metadata"],
    year: 2021,
    abstract:
      "Demo publication metadata illustrating multidisciplinary polar science knowledge discovery.",
    category: "Multidisciplinary",
    publicationUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
];

const datasets = [
  {
    name: "Antarctic Meteorology – Demo Dataset",
    description:
      "Demo dataset metadata for demonstrating discovery of Antarctic meteorological information.",
    category: "Meteorology",
    year: 2025,
    dataUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Southern Ocean Observations – Demo Dataset",
    description:
      "Demonstration dataset metadata related to Southern Ocean observations.",
    category: "Oceanography",
    year: 2025,
    dataUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Polar Cryosphere – Demo Dataset",
    description:
      "Sample metadata illustrating repository support for cryosphere datasets.",
    category: "Cryosphere",
    year: 2024,
    dataUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Arctic Environment – Demo Dataset",
    description:
      "Demo dataset record for an Arctic environmental research use case.",
    category: "Arctic Science",
    year: 2024,
    dataUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Polar Atmospheric Observations – Demo Dataset",
    description:
      "Demonstration metadata representing atmospheric observations from a polar research context.",
    category: "Atmospheric Science",
    year: 2023,
    dataUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    name: "Snow and Ice Observations – Demo Dataset",
    description:
      "Sample repository metadata associated with snow and ice observations.",
    category: "Cryosphere",
    year: 2023,
    dataUrl: NCPOR,
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
];

const activities = [
  {
    title: "Polar Science Outreach Programme – Demo Activity",
    date: new Date("2026-08-15"),
    description:
      "Demonstration institutional outreach activity for communicating polar science to wider audiences.",
    category: "Outreach",
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Research Awareness Session – Demo Activity",
    date: new Date("2026-07-10"),
    description:
      "Demo activity illustrating science awareness and knowledge dissemination workflows.",
    category: "Education",
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Student Polar Science Interaction – Demo Activity",
    date: new Date("2026-06-05"),
    description:
      "Demonstration activity representing engagement between polar science and student audiences.",
    category: "Education",
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Knowledge Dissemination Event – Demo Activity",
    date: new Date("2026-05-20"),
    description:
      "Demo institutional activity showing how scientific information can move from repository to public outreach.",
    category: "Outreach",
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Scientific Data Awareness Programme – Demo Activity",
    date: new Date("2026-04-18"),
    description:
      "Demonstration activity highlighting scientific data discovery and responsible knowledge access.",
    category: "Data Awareness",
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Science Communication Workshop – Demo Activity",
    date: new Date("2026-03-12"),
    description:
      "Demo activity representing communication and outreach around polar science research.",
    category: "Workshop",
    sourceName: "NCPOR",
    sourceUrl: NCPOR,
    published: true,
  },
];

const photos = [
  "Antarctic Landscape",
  "Polar Research Environment",
  "Southern Ocean",
  "Snow and Ice",
  "Polar Field Research",
  "Antarctic Environment",
  "Polar Observation",
  "Research Expedition",
  "Ice Landscape",
  "Scientific Fieldwork",
  "Polar Horizon",
  "Expedition Documentation",
].map((title, index) => ({
  title: `${title} – Demo Media`,
  imageUrl: `https://picsum.photos/seed/polar${index + 1}/900/600`,
  location:
    index % 2 === 0 ? "Antarctica" : "Polar Region",
  expedition: "Demo Repository",
  date: new Date(`2025-${String((index % 9) + 1).padStart(2, "0")}-10`),
  description:
    "Placeholder demonstration image for the SIH media repository. Replace with properly licensed and attributed polar imagery before final submission.",
  sourceName: "Demo Placeholder",
  sourceUrl: "https://picsum.photos/",
  published: true,
}));

const videos = [
  {
    title: "Polar Science Overview – Demo Video",
    description:
      "Demo video record illustrating video integration in the outreach repository.",
    videoUrl: "https://www.youtube.com/",
    category: "Education",
    sourceName: "Demo Video Link",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Antarctic Research – Demo Video",
    description:
      "Demonstration media metadata for an Antarctic research outreach use case.",
    videoUrl: "https://www.youtube.com/",
    category: "Expedition",
    sourceName: "Demo Video Link",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Southern Ocean Science – Demo Video",
    description:
      "Sample media record demonstrating Southern Ocean science communication.",
    videoUrl: "https://www.youtube.com/",
    category: "Ocean Science",
    sourceName: "Demo Video Link",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Polar Climate – Demo Video",
    description:
      "Demo educational media record related to polar climate communication.",
    videoUrl: "https://www.youtube.com/",
    category: "Climate",
    sourceName: "Demo Video Link",
    sourceUrl: NCPOR,
    published: true,
  },
  {
    title: "Science Outreach – Demo Video",
    description:
      "Demonstration record for institutional science outreach media.",
    videoUrl: "https://www.youtube.com/",
    category: "Outreach",
    sourceName: "Demo Video Link",
    sourceUrl: NCPOR,
    published: true,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected for seeding");

    await Promise.all([
      Expedition.deleteMany({}),
      Publication.deleteMany({}),
      Dataset.deleteMany({}),
      Photo.deleteMany({}),
      Video.deleteMany({}),
      Activity.deleteMany({}),
    ]);

    await Promise.all([
      Expedition.insertMany(expeditions),
      Publication.insertMany(publications),
      Dataset.insertMany(datasets),
      Photo.insertMany(photos),
      Video.insertMany(videos),
      Activity.insertMany(activities),
    ]);

    console.log("================================");
    console.log("SIH demo repository seeded");
    console.log("Expeditions :", expeditions.length);
    console.log("Publications:", publications.length);
    console.log("Datasets    :", datasets.length);
    console.log("Photos      :", photos.length);
    console.log("Videos      :", videos.length);
    console.log("Activities  :", activities.length);
    console.log("================================");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:");
    console.error(error);
    process.exit(1);
  }
}

seedDatabase();