import { useParams, Link } from "react-router";
import { useDocument } from "@entities/document";
import { SlidePresenter } from "@widgets/slide-presenter";

export function DocumentPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: document, isLoading } = useDocument(slug!);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <div className="text-lg text-gray-500">Document not found</div>
        <Link to="/" className="mt-4 text-sm text-blue-600 hover:underline">
          Back to documents
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            {document.meta.title}
          </h1>
        </div>
        <Link
          to={`/document/${slug}/present`}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          Present
        </Link>
      </div>

      {/* Slide viewer */}
      <div className="flex-1 overflow-hidden">
        <SlidePresenter slides={document.slides} />
      </div>
    </div>
  );
}
