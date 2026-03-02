export function NewDocumentPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-gray-900">Create a Document</h1>
      <p className="mt-2 text-gray-500">
        Tino uses a file-system based approach. Documents are React components
        in the <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">src/content/</code> directory.
      </p>

      {/* File structure */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">File Structure</h2>
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-700">
          <pre>{`src/content/
├── my-document/          # Document = directory
│   ├── meta.ts           # Metadata (title, description, tags)
│   ├── Slide01.tsx       # Slide 1
│   ├── Slide02.tsx       # Slide 2
│   └── Slide03.tsx       # Slide 3
└── _template/            # Copy this to start`}</pre>
        </div>
      </div>

      {/* Meta file */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">meta.ts</h2>
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-950 p-4 font-mono text-sm text-gray-100">
          <pre>{`import type { DocumentMeta } from "@entities/document";

const meta: DocumentMeta = {
  title: "My Document",
  description: "A brief description",
  createdAt: "${new Date().toISOString().split("T")[0]}",
  tags: ["tag1", "tag2"],
};

export default meta;`}</pre>
        </div>
      </div>

      {/* Slide file */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Slide File</h2>
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-950 p-4 font-mono text-sm text-gray-100">
          <pre>{`import { Heading, Paragraph } from "@shared/ui/components/text";

export default function Slide01() {
  return (
    <div className="space-y-6">
      <Heading level={1} content="Title" />
      <Paragraph content="Content with **markdown**." />
    </div>
  );
}`}</pre>
        </div>
      </div>

      {/* Available components */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Available Components</h2>
        <div className="mt-3 space-y-2">
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <h3 className="font-medium text-gray-800">Text</h3>
            <p className="mt-1 text-sm text-gray-500">
              Heading, Paragraph, BulletList, Callout, CodeBlock, DataTable, Quote
            </p>
            <p className="mt-1 text-xs text-gray-400">
              from <code>@shared/ui/components/text</code>
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <h3 className="font-medium text-gray-800">Diagram</h3>
            <p className="mt-1 text-sm text-gray-500">
              Flowchart, MindMap
            </p>
            <p className="mt-1 text-xs text-gray-400">
              from <code>@shared/ui/components/diagram</code>
            </p>
          </div>
        </div>
      </div>

      {/* AI prompt tip */}
      <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="font-medium text-blue-800">AI Integration</h3>
        <p className="mt-1 text-sm text-blue-700">
          External AI tools (Claude Code, etc.) can read the design system
          guide in CLAUDE.md and automatically generate slide files using
          the prebuilt components. Just describe your document and let AI
          create the .tsx files.
        </p>
      </div>
    </div>
  );
}
