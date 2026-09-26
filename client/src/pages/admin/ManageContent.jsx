import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

const configs = {
  publications: {
    heading: "Research Publications",
    singular: "Publication",
    endpoint: "/publications",
    titleKey: "title",

    initial: {
      title: "",
      authors: "",
      year: new Date().getFullYear(),
      abstract: "",
      category: "Polar Science",
      publicationUrl: "",
      sourceName: "NCPOR",
      sourceUrl: "https://ncpor.res.in/",
      published: true,
    },

    fields: [
      ["title", "Publication Title", "text"],
      ["authors", "Authors (comma separated)", "text"],
      ["year", "Year", "number"],
      ["category", "Category", "text"],
      ["publicationUrl", "Publication / PDF URL", "url"],
      ["sourceName", "Source Name", "text"],
      ["sourceUrl", "Authoritative Source URL", "url"],
      ["abstract", "Abstract / Summary", "textarea"],
    ],
  },

  datasets: {
    heading: "Scientific Datasets",
    singular: "Dataset",
    endpoint: "/datasets",
    titleKey: "name",

    initial: {
      name: "",
      description: "",
      category: "Polar Science",
      year: new Date().getFullYear(),
      dataUrl: "",
      sourceName: "NCPOR",
      sourceUrl: "https://ncpor.res.in/",
      published: true,
    },

    fields: [
      ["name", "Dataset Name", "text"],
      ["year", "Year", "number"],
      ["category", "Category", "text"],
      ["dataUrl", "Dataset / Download URL", "url"],
      ["sourceName", "Source Name", "text"],
      ["sourceUrl", "Authoritative Source URL", "url"],
      ["description", "Description", "textarea"],
    ],
  },

  activities: {
    heading: "Institutional Activities",
    singular: "Activity",
    endpoint: "/activities",
    titleKey: "title",

    initial: {
      title: "",
      date: new Date().toISOString().slice(0, 10),
      description: "",
      category: "Outreach",
      sourceName: "NCPOR",
      sourceUrl: "https://ncpor.res.in/",
      published: true,
    },

    fields: [
      ["title", "Activity Title", "text"],
      ["date", "Date", "date"],
      ["category", "Category", "text"],
      ["sourceName", "Source Name", "text"],
      ["sourceUrl", "Authoritative Source URL", "url"],
      ["description", "Description", "textarea"],
    ],
  },
};

export default function ManageContent() {
  const { type } = useParams();

  const config = useMemo(
    () => configs[type],
    [type]
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setForm(config.initial);
      loadItems();
    }
  }, [config]);

  const loadItems = async () => {
    try {
      setLoading(true);

      const response = await api.get(config.endpoint);

      setItems(response.data.data || []);
    } catch {
      toast.error("Unable to load repository content");
    } finally {
      setLoading(false);
    }
  };

  if (!config) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">
          Invalid content type
        </h1>

        <Link
          to="/admin/dashboard"
          className="mt-4 inline-block text-cyan-700"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const change = (event) => {
    const { name, value, checked, type: inputType } =
      event.target;

    setForm((old) => ({
      ...old,
      [name]:
        inputType === "checkbox"
          ? checked
          : value,
    }));
  };

  const newItem = () => {
    setEditingId(null);
    setForm({ ...config.initial });
    setShowForm(true);
  };

  const edit = (item) => {
    const values = {};

    Object.keys(config.initial).forEach((key) => {
      if (key === "authors") {
        values[key] = Array.isArray(item[key])
          ? item[key].join(", ")
          : item[key] || "";

        return;
      }

      if (key === "date") {
        values[key] = item[key]
          ? String(item[key]).slice(0, 10)
          : "";

        return;
      }

      values[key] =
        item[key] ?? config.initial[key];
    });

    setForm(values);
    setEditingId(item._id);
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const close = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const submit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
      };

      if ("year" in payload) {
        payload.year = Number(payload.year);
      }

      if (type === "publications") {
        payload.authors = form.authors
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean);
      }

      if (editingId) {
        await api.put(
          `${config.endpoint}/${editingId}`,
          payload
        );

        toast.success(
          `${config.singular} updated`
        );
      } else {
        await api.post(config.endpoint, payload);

        toast.success(
          `${config.singular} added`
        );
      }

      close();
      await loadItems();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save record"
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    const title = item[config.titleKey];

    if (
      !window.confirm(
        `Delete "${title}"?`
      )
    ) {
      return;
    }

    try {
      await api.delete(
        `${config.endpoint}/${item._id}`
      );

      toast.success(
        `${config.singular} deleted`
      );

      await loadItems();
    } catch {
      toast.error("Unable to delete record");
    }
  };

  const togglePublished = async (item) => {
    try {
      await api.put(
        `${config.endpoint}/${item._id}`,
        {
          published: !item.published,
        }
      );

      toast.success(
        item.published
          ? "Record unpublished"
          : "Record published"
      );

      await loadItems();
    } catch {
      toast.error("Unable to update status");
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
            Repository Administration
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Link
          to="/admin/dashboard"
          className="inline-flex items-center gap-2 font-semibold text-cyan-700"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-semibold uppercase tracking-wider text-cyan-700">
              Content Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#0a3558]">
              Manage {config.heading}
            </h1>

            <p className="mt-2 text-slate-500">
              Add, edit, publish and remove repository records.
            </p>
          </div>

          <button
            onClick={newItem}
            className="flex items-center gap-2 rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white"
          >
            <Plus size={18} />
            Add {config.singular}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={submit}
            className="mt-8 rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-bold text-[#0a3558]">
                {editingId
                  ? `Edit ${config.singular}`
                  : `Add ${config.singular}`}
              </h2>

              <button
                type="button"
                onClick={close}
              >
                <X className="text-slate-400" />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {config.fields.map(
                ([name, label, fieldType]) => (
                  <DynamicField
                    key={name}
                    name={name}
                    label={label}
                    fieldType={fieldType}
                    value={form[name] ?? ""}
                    onChange={change}
                  />
                )
              )}
            </div>

            <label className="mt-5 flex items-center gap-2 text-sm font-semibold">
              <input
                type="checkbox"
                name="published"
                checked={Boolean(form.published)}
                onChange={change}
              />

              Published
            </label>

            <div className="mt-7 flex gap-3">
              <button
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : `Add ${config.singular}`}
              </button>

              <button
                type="button"
                onClick={close}
                className="rounded-lg border px-5 py-3 font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-slate-500">
              Loading content...
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No records yet. Add the first {config.singular.toLowerCase()}.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-5 p-6 lg:flex-row lg:items-center"
                >
                  <div className="max-w-3xl">
                    <div className="flex gap-3 text-xs">
                      <span
                        className={
                          item.published
                            ? "rounded-full bg-green-50 px-3 py-1 font-semibold text-green-700"
                            : "rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-500"
                        }
                      >
                        {item.published
                          ? "Published"
                          : "Unpublished"}
                      </span>

                      <span className="py-1 text-slate-400">
                        {item.year ||
                          item.category ||
                          (item.date
                            ? String(item.date).slice(0, 10)
                            : "")}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#0a3558]">
                      {item[config.titleKey]}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {item.abstract ||
                        item.description ||
                        "Repository record"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        togglePublished(item)
                      }
                      className="rounded-lg border px-3 py-2 text-sm font-semibold"
                    >
                      {item.published
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      onClick={() => edit(item)}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-cyan-700"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => remove(item)}
                      className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function DynamicField({
  name,
  label,
  fieldType,
  value,
  onChange,
}) {
  const wide = fieldType === "textarea";

  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      {fieldType === "textarea" ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          required
          rows={5}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
        />
      ) : (
        <input
          type={fieldType}
          name={name}
          value={value}
          onChange={onChange}
          required={
            name === "title" ||
            name === "name" ||
            name === "year" ||
            name === "date"
          }
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
        />
      )}
    </div>
  );
}