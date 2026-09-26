import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Plus,
  Trash2,
  X,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

import api from "../../services/api";

const emptyForm = {
  name: "",
  year: new Date().getFullYear(),
  location: "",
  description: "",
  reportUrl: "",
  coverImage: "",
  sourceName: "NCPOR",
  sourceUrl: "https://ncpor.res.in/",
  featured: false,
  published: true,
};

export default function ManageExpeditions() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadItems = async () => {
    try {
      const response = await api.get("/expeditions");
      setItems(response.data.data);
    } catch {
      toast.error("Unable to load expeditions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const change = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);

    setForm({
      name: item.name || "",
      year: item.year || new Date().getFullYear(),
      location: item.location || "",
      description: item.description || "",
      reportUrl: item.reportUrl || "",
      coverImage: item.coverImage || "",
      sourceName: item.sourceName || "NCPOR",
      sourceUrl: item.sourceUrl || "",
      featured: Boolean(item.featured),
      published: Boolean(item.published),
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (event) => {
    event.preventDefault();

    setSaving(true);

    try {
      const payload = {
        ...form,
        year: Number(form.year),
      };

      if (editingId) {
        await api.put(`/expeditions/${editingId}`, payload);
        toast.success("Expedition updated");
      } else {
        await api.post("/expeditions", payload);
        toast.success("Expedition added");
      }

      closeForm();
      await loadItems();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save expedition"
      );
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/expeditions/${item._id}`);

      toast.success("Expedition deleted");
      await loadItems();
    } catch {
      toast.error("Unable to delete expedition");
    }
  };

  const togglePublished = async (item) => {
    try {
      await api.put(`/expeditions/${item._id}`, {
        published: !item.published,
      });

      toast.success(
        item.published
          ? "Expedition unpublished"
          : "Expedition published"
      );

      await loadItems();
    } catch {
      toast.error("Unable to change status");
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

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-wider text-cyan-700">
              Content Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#0a3558]">
              Manage Expeditions
            </h1>

            <p className="mt-2 text-slate-500">
              Add, edit, publish and manage expedition records.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white"
          >
            <Plus size={18} />
            Add Expedition
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={submit}
            className="mt-8 rounded-xl border bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0a3558]">
                {editingId
                  ? "Edit Expedition"
                  : "Add Expedition"}
              </h2>

              <button
                type="button"
                onClick={closeForm}
                className="text-slate-400"
              >
                <X />
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <Field
                label="Expedition Name"
                name="name"
                value={form.name}
                onChange={change}
                required
              />

              <Field
                label="Year"
                name="year"
                type="number"
                value={form.year}
                onChange={change}
                required
              />

              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={change}
                required
              />

              <Field
                label="Report / Document URL"
                name="reportUrl"
                value={form.reportUrl}
                onChange={change}
              />

              <Field
                label="Cover Image URL"
                name="coverImage"
                value={form.coverImage}
                onChange={change}
              />

              <Field
                label="Source Name"
                name="sourceName"
                value={form.sourceName}
                onChange={change}
              />

              <div className="md:col-span-2">
                <Field
                  label="Authoritative Source URL"
                  name="sourceUrl"
                  value={form.sourceUrl}
                  onChange={change}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={change}
                  required
                  rows={5}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
                />
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={change}
                />
                Featured
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  name="published"
                  checked={form.published}
                  onChange={change}
                />
                Published
              </label>
            </div>

            <div className="mt-7 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                <Save size={17} />

                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Add Expedition"}
              </button>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border px-5 py-3 font-semibold text-slate-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <section className="mt-8 overflow-hidden rounded-xl border bg-white shadow-sm">
          {loading ? (
            <div className="p-8 text-slate-500">
              Loading expeditions...
            </div>
          ) : items.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No expeditions available. Add the first record.
            </div>
          ) : (
            <div className="divide-y">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col justify-between gap-5 p-6 lg:flex-row lg:items-center"
                >
                  <div className="max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.published
                            ? "bg-green-50 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.published
                          ? "Published"
                          : "Unpublished"}
                      </span>

                      <span className="text-sm text-slate-400">
                        {item.year} • {item.location}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#0a3558]">
                      {item.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => togglePublished(item)}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold"
                    >
                      {item.published ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}

                      {item.published
                        ? "Unpublish"
                        : "Publish"}
                    </button>

                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold text-cyan-700"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>

                    <button
                      type="button"
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

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-cyan-600"
      />
    </div>
  );
}