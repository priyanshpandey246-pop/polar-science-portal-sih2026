import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, PlayCircle } from "lucide-react";
import api from "../services/api";

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/videos")
      .then((res) => setVideos(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5 font-bold">
          ❄ Polar Knowledge Portal
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-cyan-700"
        >
          <ArrowLeft size={17} />
          Home
        </Link>

        <p className="mt-8 font-semibold uppercase tracking-wider text-cyan-700">
          Media Repository
        </p>

        <h1 className="mt-2 text-4xl font-bold text-[#0a3558]">
          Polar Science Videos
        </h1>

        <p className="mt-3 text-slate-500">
          Educational, expedition and institutional polar science media.
        </p>

        {loading ? (
          <p className="mt-10 text-slate-500">
            Loading videos...
          </p>
        ) : videos.length === 0 ? (
          <div className="mt-10 rounded-xl border bg-white p-10 text-center text-slate-500">
            No videos are currently available.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <article
                key={video._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <PlayCircle />
                </div>

                <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-cyan-700">
                  {video.category}
                </div>

                <h2 className="mt-2 text-xl font-bold text-[#0a3558]">
                  {video.title}
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  {video.description}
                </p>

                <a
                  href={video.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 font-semibold text-cyan-700"
                >
                  Watch Video
                  <ExternalLink size={16} />
                </a>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}