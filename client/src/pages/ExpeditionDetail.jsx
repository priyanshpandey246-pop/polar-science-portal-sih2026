import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ExternalLink, MapPin } from "lucide-react";
import api from "../services/api";

export default function ExpeditionDetail() {
  const { id } = useParams();

  const [expedition, setExpedition] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/expeditions/${id}`)
      .then((response) => setExpedition(response.data.data))
      .catch(() => setExpedition(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading expedition...
      </div>
    );
  }

  if (!expedition) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Expedition not found</h1>

        <Link to="/expeditions" className="mt-4 inline-block text-cyan-700">
          Return to repository
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto max-w-5xl px-6 py-5 font-bold">
          ❄ Polar Knowledge Portal
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/expeditions"
          className="flex items-center gap-2 font-semibold text-cyan-700"
        >
          <ArrowLeft size={17} />
          All Expeditions
        </Link>

        <article className="mt-7 rounded-xl border bg-white p-8 shadow-sm">
          <div className="flex flex-wrap gap-5 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CalendarDays size={17} />
              {expedition.year}
            </span>

            <span className="flex items-center gap-2">
              <MapPin size={17} />
              {expedition.location}
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-bold text-[#0a3558]">
            {expedition.name}
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            {expedition.description}
          </p>

          <div className="mt-9 border-t pt-7">
            <h2 className="font-bold text-[#0a3558]">
              Source & Documentation
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Source: {expedition.sourceName}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              {expedition.reportUrl && (
                <a
                  href={expedition.reportUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white"
                >
                  View Report <ExternalLink size={16} />
                </a>
              )}

              {expedition.sourceUrl && (
                <a
                  href={expedition.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-lg border px-5 py-3 font-semibold text-slate-700"
                >
                  Authoritative Source <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}