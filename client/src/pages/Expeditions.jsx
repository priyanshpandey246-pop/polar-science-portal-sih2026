import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, ArrowRight, Search } from "lucide-react";
import api from "../services/api";

export default function Expeditions() {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadExpeditions = async () => {
      try {
        const response = await api.get("/expeditions");
        setExpeditions(response.data.data);
      } catch (err) {
        setError("Unable to load expeditions.");
      } finally {
        setLoading(false);
      }
    };

    loadExpeditions();
  }, []);

  const filtered = expeditions.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.name.toLowerCase().includes(value) ||
      item.location.toLowerCase().includes(value) ||
      item.description.toLowerCase().includes(value)
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
            Knowledge Repository
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#0a3558]">
            Polar Expeditions
          </h1>

          <p className="mt-3 max-w-2xl text-slate-600">
            Explore expedition records, locations, reports and related polar
            science resources.
          </p>

          <div className="mt-7 flex max-w-xl items-center rounded-lg border bg-white px-4 shadow-sm">
            <Search size={20} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-3 outline-none"
              placeholder="Search expeditions..."
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">
        {loading && (
          <div className="rounded-lg border bg-white p-8 text-slate-500">
            Loading repository...
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-5 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <article
                key={item._id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={16} />
                    {item.year}
                  </span>

                  <span className="flex items-center gap-1">
                    <MapPin size={16} />
                    {item.location}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-[#0a3558]">
                  {item.name}
                </h2>

                <p className="mt-3 line-clamp-3 leading-7 text-slate-600">
                  {item.description}
                </p>

                <Link
                  to={`/expeditions/${item._id}`}
                  className="mt-5 flex items-center gap-2 font-semibold text-cyan-700"
                >
                  View Expedition <ArrowRight size={17} />
                </Link>
              </article>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center text-slate-500">
            No expeditions found.
          </div>
        )}
      </main>
    </div>
  );
}