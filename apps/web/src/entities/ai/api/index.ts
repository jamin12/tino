import Anthropic from "@anthropic-ai/sdk";
import { tinoDocumentSchema } from "@entities/document";

function getApiKey(): string | null {
  return localStorage.getItem("tino_anthropic_api_key");
}

export function setApiKey(key: string): void {
  localStorage.setItem("tino_anthropic_api_key", key);
}

export function hasApiKey(): boolean {
  return !!getApiKey();
}

const SYSTEM_PROMPT = `You are a planning document generator for Tino, an AI-powered planning tool.

When the user provides a topic or request, generate a structured planning document in JSON format.

The JSON must follow this exact structure:
{
  "id": "<uuid>",
  "title": "<document title>",
  "description": "<brief description>",
  "slides": [
    {
      "id": "<uuid>",
      "title": "<slide title>",
      "layout": "default",
      "elements": [
        // Each element must have "id" (uuid string) and "type" field
        // Supported types:
        // - {"type":"heading","level":1-6,"content":"text"}
        // - {"type":"text","content":"markdown text"}
        // - {"type":"list","ordered":false,"items":["item1","item2"]}
        // - {"type":"callout","variant":"info|warning|tip|error","title":"optional","content":"text"}
        // - {"type":"code","language":"typescript","code":"code here"}
        // - {"type":"table","headers":["col1","col2"],"rows":[["val1","val2"]]}
        // - {"type":"quote","content":"text","author":"optional"}
        // - {"type":"flowchart","nodes":[{"id":"n1","label":"text","shape":"rectangle","position":{"x":0,"y":0}}],"edges":[{"id":"e1","source":"n1","target":"n2","label":"optional"}]}
        // - {"type":"mindmap","root":{"id":"r","label":"center","children":[{"id":"c1","label":"branch"}]}}
        // - {"type":"divider"}
        // - {"type":"spacer","height":24}
      ]
    }
  ],
  "metadata": {
    "createdAt": <timestamp>,
    "updatedAt": <timestamp>,
    "version": 1,
    "tags": []
  }
}

Rules:
- Generate 3-8 slides per document
- Each slide should have 2-6 elements
- Use diverse element types (mix text, diagrams, lists, callouts)
- Include at least one flowchart or mindmap
- Write content in the same language as the user's prompt
- All IDs must be unique UUID-like strings (use format like "slide-1", "elem-1-1", "node-1" etc.)
- For flowchart nodes, provide reasonable x,y positions (spaced ~200px apart)
- Return ONLY the JSON object, no markdown fencing or explanation`;

export async function generateDocument(prompt: string): Promise<ReturnType<typeof tinoDocumentSchema.parse>> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API key not set");

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from AI");
  }

  let jsonText = textBlock.text.trim();
  // Strip markdown code fences if present
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(jsonText);

  // Set timestamps
  const now = Date.now();
  parsed.metadata = {
    ...parsed.metadata,
    createdAt: now,
    updatedAt: now,
    aiModel: "claude-sonnet-4-20250514",
    originalPrompt: prompt,
  };

  // Validate with Zod
  return tinoDocumentSchema.parse(parsed);
}
