import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Database,
  BookOpen,
  Ship,
  Images,
  PlayCircle,
  Sparkles,
  ArrowRight,
  MapPin,
  CalendarDays,
} from "lucide-react";

import api from "./services/api";


const resources = [
  {
    icon: Ship,
    title: "Expeditions",
    text: "Explore polar expedition records, locations, scientific objectives and reports.",
    route: "/expeditions",
  },
  {
    icon: BookOpen,
    title: "Publications",
    text: "Discover research publications and scientific findings from polar studies.",
    route: "/publications",
  },
  {
    icon: Database,
    title: "Datasets",
    text: "Access curated scientific datasets and supporting research information.",
    route: "/datasets",
  },
  {
    icon: Images,
    title: "Photo Gallery",
    text: "Explore photographs documenting expeditions and polar environments.",
    route: "/photos",
  },
  {
    icon: PlayCircle,
    title: "Videos",
    text: "Watch educational and institutional polar science media.",
    route: "/videos",
  },
  {
    icon: Sparkles,
    title: "Ask Polar Knowledge",
    text: "Ask questions and receive repository-grounded answers with sources.",
    route: "/ask-polar",
  },
];

function App() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState([
  { value: "—", label: "Polar Expeditions", icon: Ship },
  { value: "—", label: "Research Publications", icon: BookOpen },
  { value: "—", label: "Scientific Datasets", icon: Database },
  { value: "—", label: "Media Resources", icon: Images },
]);

useEffect(() => {
  const loadStats = async () => {
    try {
      const [
        expeditions,
        publications,
        datasets,
        photos,
        videos,
      ] = await Promise.all([
        api.get("/expeditions"),
        api.get("/publications"),
        api.get("/datasets"),
        api.get("/photos"),
        api.get("/videos"),
      ]);

      setStats([
        {
          value: expeditions.data.count,
          label: "Polar Expeditions",
          icon: Ship,
        },
        {
          value: publications.data.count,
          label: "Research Publications",
          icon: BookOpen,
        },
        {
          value: datasets.data.count,
          label: "Scientific Datasets",
          icon: Database,
        },
        {
          value:
            (photos.data.count || 0) +
            (videos.data.count || 0),
          label: "Media Resources",
          icon: Images,
        },
      ]);
    } catch (error) {
      console.error("Unable to load repository statistics");
    }
  };

  loadStats();
}, []);
  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SIH Top Bar */}
      <div className="bg-[#092c4c] px-6 py-2 text-center text-xs text-blue-100">
        Smart India Hackathon 2026 • Polar Science Knowledge & Outreach Prototype
      </div>

      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 text-left"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0b4f75] text-xl text-white">
              ❄
            </div>

            <div>
              <h1 className="font-bold tracking-tight text-[#0a3558]">
                Polar Knowledge Portal
              </h1>

              <p className="text-xs text-slate-500">
                Polar Science • Research • Outreach
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
            <button
              onClick={() => navigate("/")}
              className="hover:text-blue-700"
            >
              Home
            </button>

            <button
              onClick={() => navigate("/expeditions")}
              className="hover:text-blue-700"
            >
              Expeditions
            </button>

            <button
              onClick={() => navigate("/publications")}
              className="hover:text-blue-700"
            >
              Publications
            </button>

            <button
              onClick={() => navigate("/datasets")}
              className="hover:text-blue-700"
            >
              Datasets
            </button>

            <button
              onClick={() => navigate("/ask-polar")}
              className="hover:text-blue-700"
            >
              Ask Polar
            </button>

            <button
  onClick={() => navigate("/admin/login")}
  className="rounded-md bg-[#0b4f75] px-4 py-2 text-white hover:bg-[#083d5c]"
>
  Admin Login
</button>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-br from-[#073456] via-[#0b5b80] to-[#1593b0]"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -right-20 -top-24 h-96 w-96 rounded-full bg-cyan-200 blur-3xl" />
            <div className="absolute -bottom-36 left-10 h-96 w-96 rounded-full bg-blue-100 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex rounded-full border border-cyan-200/40 bg-white/10 px-4 py-2 text-sm text-cyan-50">
                Integrated Polar Science Knowledge Repository
              </div>

              <h2 className="text-4xl font-bold leading-tight text-white md:text-6xl">
                Discover India's{" "}
                <span className="text-cyan-200">Polar Science</span>
              </h2>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-50">
                Explore expeditions, scientific publications, datasets and media
                through one unified knowledge and outreach platform.
              </p>

              {/* WORKING GLOBAL SEARCH */}
              <div className="mt-9 flex max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
                <div className="flex items-center pl-5">
                  <Search className="text-slate-400" size={22} />
                </div>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full px-4 py-4 text-slate-800 outline-none"
                  placeholder="Search expeditions, research, datasets..."
                />

                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-[#083e64] px-7 font-semibold text-white transition hover:bg-[#062f4d]"
                >
                  Search
                </button>
              </div>

              <p className="mt-3 text-sm text-cyan-100">
                Try: Antarctica, climate, ocean, expedition
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 md:grid-cols-4">
            {stats.map(({ value, label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 border-slate-200 px-4 py-7 md:border-r"
              >
                <Icon className="text-[#137ca0]" />

                <div>
                  <div className="text-2xl font-bold text-[#0a3558]">
                    {value}
                  </div>

                  <div className="text-sm text-slate-500">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Repository */}
        <section id="repository" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-semibold uppercase tracking-wider text-[#137ca0]">
              Knowledge Repository
            </p>

            <h3 className="mt-2 text-3xl font-bold text-[#0a3558]">
              Explore Polar Science Resources
            </h3>

            <p className="mt-3 text-slate-600">
              A centralized gateway for scientific knowledge, expedition records
              and outreach resources.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resources.map(({ icon: Icon, title, text, route }) => (
              <div
                key={title}
                className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-50 text-[#08769b]">
                  <Icon />
                </div>

                <h4 className="mt-5 text-xl font-bold text-[#123b5a]">
                  {title}
                </h4>

                <p className="mt-2 leading-7 text-slate-600">{text}</p>

                <button
                  type="button"
                  onClick={() => navigate(route)}
                  className="mt-5 flex items-center gap-2 font-semibold text-[#08769b]"
                >
                  Explore
                  <ArrowRight size={17} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Expeditions */}
        <section id="featured" className="bg-[#edf7fa]">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="font-semibold uppercase tracking-wider text-[#137ca0]">
                  Featured
                </p>

                <h3 className="mt-2 text-3xl font-bold text-[#0a3558]">
                  Polar Expeditions
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigate("/expeditions")}
                className="flex items-center gap-2 font-semibold text-[#08769b]"
              >
                View all expeditions
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="mt-9 grid gap-6 md:grid-cols-3">
              {[
                "Antarctic Research",
                "Arctic Studies",
                "Southern Ocean Research",
              ].map((name, index) => (
                <article
                  key={name}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex h-44 items-center justify-center bg-gradient-to-br from-sky-200 to-blue-700">
                    <span className="text-6xl">❄</span>
                  </div>

                  <div className="p-6">
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {2025 - index}
                      </span>

                      <span className="flex items-center gap-1">
                        <MapPin size={14} />
                        Polar Region
                      </span>
                    </div>

                    <h4 className="mt-3 text-xl font-bold text-[#0a3558]">
                      {name}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Demonstration repository record. Verified expedition
                      information is available through repository records and
                      authoritative sources.
                    </p>

                    <button
                      type="button"
                      onClick={() => navigate("/expeditions")}
                      className="mt-4 font-semibold text-[#08769b]"
                    >
                      View expedition →
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* AI */}
        <section id="ai" className="mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl bg-[#073b5c] p-8 text-white md:p-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 font-semibold text-cyan-200">
                <Sparkles size={20} />
                AI-powered repository discovery
              </div>

              <h3 className="mt-4 text-3xl font-bold">
                Ask Polar Knowledge
              </h3>

              <p className="mt-3 leading-7 text-blue-100">
                Ask questions about available polar research. Answers are
                grounded in repository records and accompanied by relevant
                sources.
              </p>

              <button
                type="button"
                onClick={() => navigate("/ask-polar")}
                className="mt-7 rounded-lg bg-white px-6 py-3 font-bold text-[#073b5c] hover:bg-cyan-50"
              >
                Ask a Question
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#062b45] text-blue-100">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="font-bold text-white">
            Polar Knowledge Portal
          </div>

          <p className="mt-2 max-w-xl text-sm leading-6 text-blue-200">
            SIH 2026 functional prototype for integrated polar science
            knowledge, outreach and media dissemination.
          </p>

          <div className="mt-8 border-t border-white/10 pt-5 text-xs text-blue-300">
            Prototype for Smart India Hackathon 2026 • Scientific information
            will be attributed to authoritative public sources.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;