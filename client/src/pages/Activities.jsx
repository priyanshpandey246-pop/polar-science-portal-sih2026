import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CalendarDays } from "lucide-react";
import api from "../services/api";

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/activities")
      .then((res) => setActivities(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 font-bold">
          ❄ Polar Knowledge Portal
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-cyan-700"
        >
          <ArrowLeft size={17} />
          Home
        </Link>

        <p className="mt-8 font-semibold uppercase tracking-wider text-cyan-700">
          Institutional Outreach
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#0a3558]">
          Institutional Activities
        </h1>

        {loading ? (
          <p className="mt-10 text-slate-500">
            Loading activities...
          </p>
        ) : activities.length === 0 ? (
          <div className="mt-10 rounded-xl border bg-white p-10 text-center text-slate-500">
            No activities are currently available.
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {activities.map((activity) => (
              <article
                key={activity._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />

                    {activity.date
                      ? new Date(
                          activity.date
                        ).toLocaleDateString("en-IN")
                      : "Date unavailable"}
                  </span>

                  <span className="rounded-full bg-cyan-50 px-3 py-1 font-semibold text-cyan-700">
                    {activity.category}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-[#0a3558]">
                  {activity.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {activity.description}
                </p>

                {activity.sourceUrl && (
                  <a
                    href={activity.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block font-semibold text-cyan-700"
                  >
                    Authoritative Source →
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