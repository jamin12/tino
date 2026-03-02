import { Link } from "react-router";
import type { TinoDocument } from "@entities/document";

interface Props {
  documents: TinoDocument[];
  onDelete?: (id: string) => void;
}

export function DocumentList({ documents, onDelete }: Props) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-5xl">📄</div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No documents yet
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          Create a new document to get started.
        </p>
        <Link
          to="/new"
          className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          + New Document
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="group rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <Link to={`/document/${doc.id}`} className="block">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
              {doc.title}
            </h3>
            {doc.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {doc.description}
              </p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
              <span>{doc.slides.length} slides</span>
              <span>
                {new Date(doc.metadata.updatedAt).toLocaleDateString("ko-KR")}
              </span>
            </div>
          </Link>
          {onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onDelete(doc.id);
              }}
              className="mt-3 text-xs text-gray-400 transition-colors hover:text-red-500"
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
