import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      localStorage.setItem(
        "polar_admin_token",
        response.data.token
      );

      localStorage.setItem(
        "polar_admin_user",
        JSON.stringify(response.data.user)
      );

      toast.success("Login successful");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-bold text-[#0a3558]">
            ❄ Polar Knowledge Portal
          </Link>

          <Link
            to="/"
            className="text-sm font-medium text-slate-500 hover:text-cyan-700"
          >
            ← Public Portal
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-70px)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#073b5c] text-white">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-[#0a3558]">
            Administrator Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to manage the Polar Science Knowledge Repository and
            outreach workflow.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-cyan-600">
                <Mail size={18} className="text-slate-400" />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@polarportal.in"
                  className="w-full px-3 py-3 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <div className="flex items-center rounded-lg border border-slate-300 px-3 focus-within:border-cyan-600">
                <LockKeyhole size={18} className="text-slate-400" />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter administrator password"
                  className="w-full px-3 py-3 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white hover:bg-[#052e48] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs leading-5 text-slate-500">
            Protected administrator access • Authorized users only
        </div>
        </div>
      </main>
    </div>
  );
}