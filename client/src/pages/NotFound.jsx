import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="text-center">
        <div className="text-7xl font-bold text-cyan-700">
          404
        </div>

        <h1 className="mt-5 text-3xl font-bold text-[#0a3558]">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The requested Polar Knowledge Portal page could not be found.
        </p>

        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#073b5c] px-5 py-3 font-semibold text-white"
        >
          <Home size={17} />
          Return Home
        </Link>
      </div>
    </div>
  );
}