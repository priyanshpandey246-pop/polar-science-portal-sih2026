import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  Search,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../services/api";

const examples = [
  "What information is available about Antarctica?",
  "What polar datasets are available?",
  "Show research related to the Southern Ocean",
];

export default function AskPolar() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ask = async (event) => {
    event?.preventDefault();

    if (!question.trim()) {
      toast.error("Enter a question first");
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const response = await api.post(
        "/ask-polar",
        {
          question: question.trim(),
        }
      );

      setResult(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to query Polar Knowledge"
      );
    } finally {
      setLoading(false);
    }
  };

  const useExample = (text) => {
    setQuestion(text);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="font-bold">
            ❄ Polar Knowledge Portal
          </Link>

          <div className="text-sm text-cyan-100">
            Repository-grounded knowledge assistant
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-semibold text-cyan-700"
        >
          <ArrowLeft size={17} />
          Home
        </Link>

        <section className="mt-7 rounded-2xl bg-gradient-to-r from-[#073b5c] to-[#0d718c] p-8 text-white md:p-10">
          <div className="flex items-center gap-2 text-cyan-200">
            <Sparkles size={21} />
            <span className="font-semibold">
              Repository-grounded AI discovery
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold">
            Ask Polar Knowledge
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-blue-100">
            Ask a question about content available in the Polar
            Knowledge Repository. Answers use repository records and
            show the supporting sources.
          </p>
        </section>

        <section className="-mt-4 mx-4 rounded-xl border bg-white p-6 shadow-lg md:mx-8">
          <form onSubmit={ask}>
            <label className="block font-semibold text-[#0a3558]">
              What would you like to know?
            </label>

            <div className="mt-3 flex flex-col gap-3 md:flex-row">
              <div className="flex flex-1 items-center rounded-lg border border-slate-300 px-4 focus-within:border-cyan-600">
                <Search
                  size={20}
                  className="text-slate-400"
                />

                <input
                  value={question}
                  onChange={(e) =>
                    setQuestion(e.target.value)
                  }
                  placeholder="Ask about expeditions, research or datasets..."
                  className="w-full px-3 py-4 outline-none"
                />
              </div>

              <button
                disabled={loading}
                className="rounded-lg bg-[#073b5c] px-7 py-4 font-semibold text-white disabled:opacity-50"
              >
                {loading
                  ? "Searching..."
                  : "Ask Polar"}
              </button>
            </div>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() =>
                  useExample(example)
                }
                className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600 hover:bg-cyan-50 hover:text-cyan-700"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        {loading && (
          <div className="mt-8 rounded-xl border bg-white p-8">
            <div className="animate-pulse">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="mt-5 h-4 rounded bg-slate-200" />
              <div className="mt-3 h-4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />
            </div>
          </div>
        )}

        {!loading && result && (
          <section className="mt-8 rounded-xl border bg-white p-7 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="text-cyan-700" />

              <h2 className="text-xl font-bold text-[#0a3558]">
                Repository Answer
              </h2>
            </div>

           <div className="mt-4 flex flex-wrap gap-2">
  <div
    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
      result.grounded
        ? "bg-green-50 text-green-700"
        : "bg-amber-50 text-amber-700"
    }`}
  >
    {result.grounded
      ? "✓ Grounded in Repository"
      : "Insufficient Repository Evidence"}
  </div>

  {result.mode === "repository-grounded-ai" && (
    <div className="inline-flex rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
      ✦ AI Synthesized
    </div>
  )}

  {result.mode === "repository-grounded-fallback" && (
    <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      Repository Fallback
    </div>
  )}
</div>

            <p className="mt-5 whitespace-pre-line leading-8 text-slate-700">
              {result.answer}
            </p>

            <div className="mt-8 border-t pt-6">
              <div className="flex items-center gap-2">
                <BookOpen
                  size={19}
                  className="text-cyan-700"
                />

                <h3 className="font-bold text-[#0a3558]">
                  Sources
                </h3>
              </div>

              {result.sources?.length ? (
                <div className="mt-4 grid gap-3">
                  {result.sources.map(
                    (source) => (
                      <div
                        key={`${source.type}-${source.id}`}
                        className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-4 md:flex-row md:items-center"
                      >
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
                            {source.type}
                          </span>

                          <div className="mt-1 font-semibold text-slate-800">
                            {source.title}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {source.url && (
                            <Link
                              to={source.url}
                              className="rounded-lg border px-3 py-2 text-sm font-semibold text-cyan-700"
                            >
                              View Record
                            </Link>
                          )}

                          {source.sourceUrl && (
                            <a
                              href={
                                source.sourceUrl
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-slate-600"
                            >
                              Source
                              <ExternalLink
                                size={14}
                              />
                            </a>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  No supporting repository sources were found.
                </p>
              )}
            </div>
          </section>
        )}

        <div className="mt-8 rounded-lg bg-blue-50 p-4 text-sm leading-6 text-blue-800">
          This prototype is designed to answer from available repository
          information. When sufficient evidence is not available, it
          avoids presenting unsupported scientific claims.
        </div>
      </main>
    </div>
  );
}