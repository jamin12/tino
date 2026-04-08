import { Link, Outlet, useLocation } from "react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, BookOpen } from "lucide-react";

export function AppLayout() {
  const location = useLocation();
  const isDocumentView = location.pathname.startsWith("/document/");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isDocumentView ? "hidden" : isSidebarOpen ? "w-64" : "w-[68px]"
        } relative flex flex-col border-r border-gray-200 bg-white transition-all duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-[18px] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 shadow-sm"
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>

        <div
          className={`flex h-14 items-center border-b border-gray-200 ${
            isSidebarOpen ? "px-4" : "justify-center"
          }`}
        >
          <Link
            to="/"
            className="text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden"
          >
            {isSidebarOpen ? "Tino" : "T"}
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3 overflow-x-hidden">
          <Link
            to="/"
            title={!isSidebarOpen ? "Documents" : undefined}
            className={`flex items-center rounded-lg py-2 transition-colors ${
              isSidebarOpen ? "px-3" : "justify-center"
            } ${
              location.pathname === "/"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <FileText className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="ml-3 text-sm font-medium">Documents</span>
            )}
          </Link>
          <Link
            to="/new"
            title={!isSidebarOpen ? "Guide" : undefined}
            className={`flex items-center rounded-lg py-2 transition-colors ${
              isSidebarOpen ? "px-3" : "justify-center"
            } ${
              location.pathname === "/new"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <BookOpen className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="ml-3 text-sm font-medium">Guide</span>
            )}
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
