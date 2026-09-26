import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Ship,
  BookOpen,
  Database,
  Images,
  PlayCircle,
  CalendarDays,
} from "lucide-react";
import api from "../services/api";

const sections = [
  {
    key: "expeditions",
    label: "Expeditions",
    icon: Ship,
  },
  {
    key: "publications",
    label: "Publications",
    icon: BookOpen,
  },
  {
    key: "datasets",
    label: "Datasets",
    icon: Database,
  },
  {
    key: "photos",
    label: "Photographs",
    icon: Images,
  },
  {
    key: "videos",
    label: "Videos",
    icon: PlayCircle,
  },
  {
    key: "activities",
    label: "Activities",
    icon: CalendarDays,
  },
];

const getTitle = (item) => item.name || item.title;

export default function SearchPage() {
  const [params, setParams] = useSearchParams();

  const initialQuery = params.get("q") || "";

  const [input, setInput] = useState(initialQuery);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const query = params.get("q") || "";

  useEffect(() => {
    if (!query) {
      setData(null);
      return;
    }

    setLoading(true);

    api
      .get("/search", {
        params: { q: query },
      })
      .then((response) => setData(response.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  const submit = (e) => {
    e.preventDefault();

    if (input.trim()) {
      setParams({ q: input.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link to="/" className="font-bold">
            ❄ Polar Knowledge Portal
          </Link>
        </div>
      </header>

      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-3xl font-bold text-[#0a3558]">
            Search Polar Knowledge
          </h1>

          <form
            onSubmit={submit}
            className="mt-6 flex max-w-3xl overflow-hidden rounded-lg border shadow-sm"
          >
            <div className="flex flex-1 items-center bg-white px-4">
              <Search size={20} className="text-slate-400" />

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full px-3 py-3 outline-none"
                placeholder="Search across the repository..."
              />
            </div>

            <button className="bg-[#073b5c] px-7 font-semibold text-white">
              Search
            </button>
          </form>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {loading && <p className="text-slate-500">Searching repository...</p>}

        {!loading && data && (
          <>
            <p className="mb-8 text-slate-600">
              Found <strong>{data.total}</strong> results for{" "}
              <strong>"{data.query}"</strong>
            </p>

            {data.total === 0 && (
              <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
                No repository records matched your search.
              </div>
            )}

            <div className="space-y-9">
              {sections.map(({ key, label, icon: Icon }) => {
                const items = data.results[key] || [];

                if (!items.length) return null;

                return (
                  <section key={key}>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-[#0a3558]">
                      <Icon size={21} className="text-cyan-700" />
                      {label}
                      <span className="text-sm font-normal text-slate-400">
                        ({items.length})
                      </span>
                    </h2>

                    <div className="mt-4 grid gap-3">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-lg border bg-white p-5"
                        >
                          {key === "expeditions" ? (
                            <Link
                              to={`/expeditions/${item._id}`}
                              className="font-bold text-[#0a3558] hover:text-cyan-700"
                            >
                              {getTitle(item)}
                            </Link>
                          ) : (
                            <h3 className="font-bold text-[#0a3558]">
                              {getTitle(item)}
                            </h3>
                          )}

                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                            {item.description ||
                              item.abstract ||
                              item.category}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}