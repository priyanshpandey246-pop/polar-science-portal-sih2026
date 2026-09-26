import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  Sparkles,
  Save,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

const fields = [
  ["websiteSummary", "Website Summary"],
  ["linkedinPost", "LinkedIn Post"],
  ["instagramCaption", "Instagram Caption"],
  ["xPost", "X / Twitter Post"],
  ["announcement", "Short Announcement"],
];

export default function OutreachGenerator() {
  const [sourceType, setSourceType] =
    useState("expedition");

  const [records, setRecords] = useState([]);
  const [sourceId, setSourceId] = useState("");

  const [draft, setDraft] = useState(null);

  const [loadingRecords, setLoadingRecords] =
    useState(false);

  const [generating, setGenerating] =
    useState(false);

  useEffect(() => {
    loadRecords();
  }, [sourceType]);

  const getEndpoint = () => {
    if (sourceType === "publication") {
      return "/publications";
    }

    if (sourceType === "activity") {
      return "/activities";
    }

    return "/expeditions";
  };

  const getTitle = (item) =>
    item.title || item.name;

  const loadRecords = async () => {
    try {
      setLoadingRecords(true);
      setSourceId("");
      setDraft(null);

      const response = await api.get(
        getEndpoint()
      );

      setRecords(response.data.data || []);
    } catch {
      toast.error(
        "Unable to load repository records"
      );
    } finally {
      setLoadingRecords(false);
    }
  };

  const generate = async () => {
    if (!sourceId) {
      toast.error(
        "Select a repository record"
      );
      return;
    }

    try {
      setGenerating(true);

      const response = await api.post(
        "/outreach/generate",
        {
          sourceType,
          sourceId,
        }
      );

      setDraft(response.data.data);

      toast.success(
        "Outreach draft generated"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Generation failed"
      );
    } finally {
      setGenerating(false);
    }
  };

  const changeDraft = (event) => {
    setDraft({
      ...draft,
      [event.target.name]:
        event.target.value,
    });
  };

  const save = async () => {
    try {
      const payload = {};

      fields.forEach(([key]) => {
        payload[key] = draft[key];
      });

      const response = await api.put(
        `/outreach/${draft._id}`,
        payload
      );

      setDraft(response.data.data);

      toast.success("Draft saved");
    } catch {
      toast.error("Unable to save draft");
    }
  };

  const setStatus = async (status) => {
    try {
      const response = await api.patch(
        `/outreach/${draft._id}/status`,
        {
          status,
        }
      );

      setDraft(response.data.data);

      toast.success(
        status === "approved"
          ? "Content approved"
          : "Content published"
      );
    } catch {
      toast.error(
        "Unable to update status"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="font-bold">
            ❄ Polar Knowledge Portal
          </div>

          <div className="text-xs text-cyan-100">
            AI-assisted Outreach Workflow
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 font-semibold text-cyan-700"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-2 font-semibold uppercase tracking-wider text-cyan-700">
            <Sparkles size={19} />
            Smart Dissemination
          </div>

          <h1 className="mt-2 text-3xl font-bold text-[#0a3558]">
            Outreach Content Generator
          </h1>

          <p className="mt-2 max-w-3xl leading-7 text-slate-500">
            Select verified repository information and generate
            channel-specific outreach drafts for review, approval and
            publication.
          </p>
        </div>

        <section className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Repository Type
              </label>

              <select
                value={sourceType}
                onChange={(event) =>
                  setSourceType(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border px-4 py-3 outline-none"
              >
                <option value="expedition">
                  Expedition
                </option>

                <option value="publication">
                  Publication
                </option>

                <option value="activity">
                  Institutional Activity
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Repository Record
              </label>

              <select
                value={sourceId}
                onChange={(event) =>
                  setSourceId(
                    event.target.value
                  )
                }
                disabled={loadingRecords}
                className="w-full rounded-lg border px-4 py-3 outline-none disabled:bg-slate-100"
              >
                <option value="">
                  {loadingRecords
                    ? "Loading records..."
                    : "Select a record"}
                </option>

                {records.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {getTitle(item)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={
              generating || !sourceId
            }
            className="mt-6 flex items-center gap-2 rounded-lg bg-[#073b5c] px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            <Sparkles size={18} />

            {generating
              ? "Generating..."
              : "Generate Outreach Content"}
          </button>
        </section>

        {draft && (
          <section className="mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
  {draft.generationMode === "gemini-grounded" ? (
    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
      ✦ AI Generated from Repository
    </span>
  ) : (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      Template Fallback
    </span>
  )}

  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
    ✓ Repository Grounded
  </span>
</div>
                <div className="text-sm text-slate-500">
                  Generated from
                </div>

                <h2 className="text-xl font-bold text-[#0a3558]">
                  {draft.sourceTitle}
                </h2>
              </div>

              <span
                className={`rounded-full px-4 py-2 text-xs font-bold uppercase ${
                  draft.status ===
                  "published"
                    ? "bg-green-100 text-green-700"
                    : draft.status ===
                      "approved"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {draft.status}
              </span>
            </div>

            <div className="mt-5 grid gap-5">
              {fields.map(
                ([name, label]) => (
                  <div
                    key={name}
                    className="rounded-xl border bg-white p-6 shadow-sm"
                  >
                    <label className="font-bold text-[#0a3558]">
                      {label}
                    </label>

                    <textarea
                      name={name}
                      value={
                        draft[name] || ""
                      }
                      onChange={
                        changeDraft
                      }
                      rows={
                        name ===
                        "xPost"
                          ? 3
                          : 6
                      }
                      className="mt-3 w-full rounded-lg border border-slate-300 p-4 leading-7 outline-none focus:border-cyan-600"
                    />

                    {name === "xPost" && (
                      <div className="mt-1 text-right text-xs text-slate-400">
                        {
                          (
                            draft[name] ||
                            ""
                          ).length
                        }{" "}
                        characters
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            <div className="sticky bottom-4 mt-6 flex flex-wrap gap-3 rounded-xl border bg-white/95 p-4 shadow-lg backdrop-blur">
              <button
                onClick={save}
                className="flex items-center gap-2 rounded-lg border px-5 py-3 font-semibold"
              >
                <Save size={17} />
                Save Edits
              </button>

              {draft.status ===
                "draft" && (
                <button
                  onClick={() =>
                    setStatus(
                      "approved"
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white"
                >
                  <CheckCircle2
                    size={17}
                  />
                  Approve
                </button>
              )}

              {draft.status ===
                "approved" && (
                <button
                  onClick={() =>
                    setStatus(
                      "published"
                    )
                  }
                  className="flex items-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white"
                >
                  <Send size={17} />
                  Publish
                </button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}