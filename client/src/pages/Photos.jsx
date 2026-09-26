import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Image as ImageIcon, MapPin } from "lucide-react";
import api from "../services/api";

export default function Photos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/photos")
      .then((res) => setPhotos(res.data.data || []))
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
          Polar Photo Gallery
        </h1>

        <p className="mt-3 text-slate-500">
          Photographs documenting polar expeditions, environments and
          institutional activities.
        </p>

        {loading ? (
          <p className="mt-10 text-slate-500">
            Loading photographs...
          </p>
        ) : photos.length === 0 ? (
          <div className="mt-10 rounded-xl border bg-white p-10 text-center text-slate-500">
            No photographs are currently available.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo) => (
              <article
                key={photo._id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >
                {photo.imageUrl ? (
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center bg-slate-100">
                    <ImageIcon
                      size={40}
                      className="text-slate-300"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-lg font-bold text-[#0a3558]">
                    {photo.title}
                  </h2>

                  {photo.location && (
                    <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin size={14} />
                      {photo.location}
                    </div>
                  )}

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {photo.description}
                  </p>

                  {photo.sourceUrl && (
                    <a
                      href={photo.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-block text-sm font-semibold text-cyan-700"
                    >
                      Source →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}