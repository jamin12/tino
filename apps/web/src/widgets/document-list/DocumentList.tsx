import { Link } from "react-router";
import type { DiscoveredDocument } from "@entities/document";

interface Props {
  documents: DiscoveredDocument[];
}

export function DocumentList({ documents }: Props) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl">📄</div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No documents yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Create slides in the <code className="rounded bg-gray-100 px-1">src/content/</code> directory to get started.
        </p>
        <Link
          to="/new"
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          View Guide
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <Link
          key={doc.slug}
          to={`/document/${doc.slug}`}
          className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
            {doc.meta.title}
          </h3>
          {doc.meta.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {doc.meta.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
            <span>{doc.slideCount} slides</span>
            <span>{doc.meta.createdAt}</span>
          </div>
          {doc.meta.tags && doc.meta.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {doc.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
