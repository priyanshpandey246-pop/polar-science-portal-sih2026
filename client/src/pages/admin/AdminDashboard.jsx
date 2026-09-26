import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ship,
  BookOpen,
  Database,
  Images,
  PlayCircle,
  CalendarDays,
  LogOut,
  Sparkles,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

const modules = [
  {
    key: "expeditions",
    label: "Expeditions",
    icon: Ship,
    route: "/admin/expeditions",
  },
  {
    key: "publications",
    label: "Publications",
    icon: BookOpen,
    route: "/admin/manage/publications",
  },
  {
    key: "datasets",
    label: "Datasets",
    icon: Database,
    route: "/admin/manage/datasets",
  },
  {
    key: "photos",
    label: "Photos",
    icon: Images,
    route: "/photos",
  },
  {
    key: "videos",
    label: "Videos",
    icon: PlayCircle,
    route: "/videos",
  },
  {
    key: "activities",
    label: "Activities",
    icon: CalendarDays,
    route: "/admin/manage/activities",
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const responses = await Promise.all([
          api.get("/expeditions"),
          api.get("/publications"),
          api.get("/datasets"),
          api.get("/photos"),
          api.get("/videos"),
          api.get("/activities"),
        ]);

        setStats({
          expeditions: responses[0].data.count || 0,
          publications: responses[1].data.count || 0,
          datasets: responses[2].data.count || 0,
          photos: responses[3].data.count || 0,
          videos: responses[4].data.count || 0,
          activities: responses[5].data.count || 0,
        });
      } catch {
        toast.error("Unable to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const logout = () => {
    localStorage.removeItem("polar_admin_token");
    localStorage.removeItem("polar_admin_user");

    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-[#073b5c] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <div className="font-bold">
              ❄ Polar Knowledge Portal
            </div>
            <div className="text-xs text-cyan-100">
              Administration Console
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-lg border border-white/20 px-4 py-2 text-sm"
            >
              <ExternalLink size={16} />
              Public Portal
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#073b5c]"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <p className="font-semibold uppercase tracking-wider text-cyan-700">
          Repository Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#0a3558]">
          Polar Science Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Manage repository records and science outreach workflows.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map(({ key, label, icon: Icon, route }) => (
            <button
              key={key}
              onClick={() => navigate(route)}
              className="group rounded-xl border bg-white p-6 text-left shadow-sm transition hover:border-cyan-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                  <Icon />
                </div>

                <ArrowRight className="text-slate-300 group-hover:text-cyan-700" />
              </div>

              <div className="mt-5 text-3xl font-bold text-[#0a3558]">
                {loading ? "—" : stats[key] || 0}
              </div>

              <div className="mt-1 font-semibold text-slate-600">
                {label}
              </div>
            </button>
          ))}
        </div>

        <section className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-[#073b5c] to-[#0b718b] p-8 text-white">
          <div className="flex items-center gap-2 text-cyan-200">
            <Sparkles size={20} />
            Intelligent Outreach Workflow
          </div>

          <h2 className="mt-3 text-2xl font-bold">
            Repository → Outreach
          </h2>

          <p className="mt-2 max-w-2xl leading-7 text-blue-100">
            Transform verified expedition, publication and institutional
            activity information into channel-specific communication drafts.
          </p>

          <button
            onClick={() => navigate("/admin/outreach")}
            className="mt-6 rounded-lg bg-white px-5 py-3 font-bold text-[#073b5c]"
          >
            Open Outreach Generator
          </button>
        </section>
      </main>
    </div>
  );
}