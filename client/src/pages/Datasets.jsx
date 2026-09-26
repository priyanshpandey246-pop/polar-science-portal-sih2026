import { useEffect, useState } from "react";
import { Database, Download, Search } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Datasets() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/datasets")
      .then((response) => setItems(response.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
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
            Scientific Data
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0a3558]">
            Scientific Datasets
          </h1>

          <p className="mt-3 text-slate-600">
            Discover scientific dataset metadata and available data resources.
          </p>

          <div className="mt-7 flex max-w-xl items-center rounded-lg border bg-white px-4">
            <Search size={20} className="text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets..."
              className="w-full px-3 py-3 outline-none"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {loading ? (
          <p className="text-slate-500">Loading datasets...</p>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
            No datasets found.
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filtered.map((item) => (
              <article
                key={item._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <Database />
                </div>

                <div className="mt-4 text-sm font-semibold text-cyan-700">
                  {item.category} • {item.year}
                </div>

                <h2 className="mt-2 text-xl font-bold text-[#0a3558]">
                  {item.name}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {item.description}
                </p>

                {(item.dataUrl || item.sourceUrl) && (
                  <a
                    href={item.dataUrl || item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-700"
                  >
                    <Download size={17} />
                    View / Access
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}