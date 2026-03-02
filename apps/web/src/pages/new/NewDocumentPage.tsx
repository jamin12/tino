import { useState } from "react";
import { hasApiKey, setApiKey } from "@entities/ai";
import { useGenerateDocument } from "@features/generate-document";
import { useCreateNewDocument } from "@features/create-document";

export function NewDocumentPage() {
  const [prompt, setPrompt] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showApiKeyForm, setShowApiKeyForm] = useState(!hasApiKey());
  const { generate, isGenerating, error } = useGenerateDocument();
  const { createEmpty } = useCreateNewDocument();

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setShowApiKeyForm(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    try {
      await generate(prompt.trim());
    } catch {
      // error is handled in the hook
    }
  };

  const handleCreateEmpty = () => {
    createEmpty("Untitled Document");
  };

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-gray-900">New Document</h1>
      <p className="mt-2 text-gray-500">
        Describe what you want to plan, and AI will generate a structured document.
      </p>

      {/* API Key Setup */}
      {showApiKeyForm && (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h3 className="font-medium text-yellow-800">API Key Required</h3>
          <p className="mt-1 text-sm text-yellow-700">
            Enter your Anthropic API key to enable AI generation.
          </p>
          <div className="mt-3 flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              className="flex-1 rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
            />
            <button
              onClick={handleSaveApiKey}
              className="rounded-lg bg-yellow-600 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mt-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Design a user authentication system with OAuth 2.0, JWT tokens, and role-based access control..."
          rows={5}
          className="w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isGenerating}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim() || showApiKeyForm}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          {isGenerating ? "Generating..." : "Generate with AI"}
        </button>
        <button
          onClick={handleCreateEmpty}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Create Empty
        </button>
        {!showApiKeyForm && (
          <button
            onClick={() => setShowApiKeyForm(true)}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600"
          >
            Change API Key
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isGenerating && (
        <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
          AI is generating your document...
        </div>
      )}
    </div>
  );
}
