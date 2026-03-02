import { Heading } from "@shared/ui/components/text";
import { MindMap } from "@shared/ui/components/diagram";

export default function Slide03() {
  return (
    <div className="space-y-6">
      <Heading level={2} content="프로젝트 구조" />
      <MindMap
        root={{
          id: "root",
          label: "SaaS Platform",
          children: [
            {
              id: "frontend",
              label: "Frontend",
              children: [
                { id: "react", label: "React" },
                { id: "tailwind", label: "Tailwind CSS" },
              ],
            },
            {
              id: "backend",
              label: "Backend",
              children: [
                { id: "api", label: "REST API" },
                { id: "db", label: "Database" },
              ],
            },
            {
              id: "infra",
              label: "Infrastructure",
              children: [
                { id: "ci", label: "CI/CD" },
                { id: "monitor", label: "Monitoring" },
              ],
            },
          ],
        }}
      />
    </div>
  );
}
