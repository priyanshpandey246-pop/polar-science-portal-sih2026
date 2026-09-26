import { useEffect, useState } from "react";
import { BookOpen, ExternalLink, Search } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Publications() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/publications")
      .then((response) => setItems(response.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();

    return (
      item.title.toLowerCase().includes(q) ||
      item.abstract.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <Link to="/" className="font-bold">
            ❄ Polar Knowledge Portal
          </Link>
        </div>
      </header>

      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="font-semibold uppercase tracking-wider text-cyan-700">
            Research Repository
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0a3558]">
            Research Publications
          </h1>

          <p className="mt-3 text-slate-600">
            Browse polar science publications, abstracts and authoritative
            source links.
          </p>

          <div className="mt-7 flex max-w-xl items-center rounded-lg border bg-white px-4">
            <Search className="text-slate-400" size={20} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search publications..."
              className="w-full px-3 py-3 outline-none"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <p className="text-slate-500">Loading publications...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
            No publications found.
          </div>
        ) : (
          <div className="grid gap-5">
            {filtered.map((item) => (
              <article
                key={item._id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-cyan-50 p-3 text-cyan-700">
                    <BookOpen />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                      <span>{item.year}</span>
                      <span>•</span>
                      <span>{item.category}</span>
                    </div>

                    <h2 className="mt-2 text-xl font-bold text-[#0a3558]">
                      {item.title}
                    </h2>

                    {item.authors?.length > 0 && (
                      <p className="mt-2 text-sm font-medium text-slate-500">
                        {item.authors.join(", ")}
                      </p>
                    )}

                    <p className="mt-3 leading-7 text-slate-600">
                      {item.abstract}
                    </p>

                    {(item.publicationUrl || item.sourceUrl) && (
                      <a
                        href={item.publicationUrl || item.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-700"
                      >
                        Open publication
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}