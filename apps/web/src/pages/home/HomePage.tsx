import { Link } from "react-router";
import { useDocuments } from "@entities/document";
import { DocumentList } from "@widgets/document-list";

export function HomePage() {
  const { data: documents, isLoading } = useDocuments();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <Link
          to="/new"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Guide
        </Link>
      </div>
      <DocumentList documents={documents ?? []} />
    </div>
  );
}
