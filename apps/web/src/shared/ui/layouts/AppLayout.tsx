import { Link, Outlet, useLocation } from "react-router";

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Tino
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <Link
            to="/"
            className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              location.pathname === "/"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Documents
          </Link>
          <Link
            to="/new"
            className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            Guide
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
