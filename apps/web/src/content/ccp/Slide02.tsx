import {
  CheckCircle2,
  Clock,
  CircleDashed,
  RefreshCw,
  GitCommit,
  User,
  Activity,
  Box,
  Terminal,
  Copy,
  Download,
} from "lucide-react";
import {
  Badge,
  Button,
  CcpDashboardLayout,
  Tabs,
} from "./_components";

// ─── Data ───────────────────────────────────────────────────────────────────

const pipelineStages = [
  { id: "fetch", name: "Fetch Repository", status: "success", duration: "12s" },
  {
    id: "build",
    name: "Maven Build & Test",
    status: "success",
    duration: "1m 45s",
  },
  {
    id: "docker",
    name: "Dockerize & Push",
    status: "running",
    duration: "45s",
  },
  { id: "manifest", name: "Update Manifest", status: "pending", duration: "-" },
  { id: "sync", name: "ArgoCD Sync", status: "pending", duration: "-" },
];

const logs = `[INFO] Scanning for projects...
[INFO]
[INFO] -------------------< com.nhncloud:backend-api >--------------------
[INFO] Building Backend API 1.0.0-SNAPSHOT
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-resources-plugin:3.2.0:resources (default-resources) @ backend-api ---
[INFO] Using 'UTF-8' encoding to copy filtered resources.
[INFO] Using 'UTF-8' encoding to copy filtered properties files.
[INFO] Copying 1 resource
[INFO] Copying 0 resource
[INFO]
[INFO] --- maven-compiler-plugin:3.8.1:compile (default-compile) @ backend-api ---
[INFO] Changes detected - recompiling the module!
[INFO] Compiling 25 source files to /app/target/classes
[INFO]
[INFO] --- maven-surefire-plugin:2.22.2:test (default-test) @ backend-api ---
[INFO]
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.nhncloud.api.ApplicationTests
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.502 s - in com.nhncloud.api.ApplicationTests
[INFO]
[INFO] Results:
[INFO]
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO]
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  1m 45s
[INFO] Finished at: 2026-03-04T15:10:20+09:00
[INFO] ------------------------------------------------------------------------
`;

export default function Slide02() {
  return (
    <CcpDashboardLayout
      breadcrumbs={[
        { label: "CI/CD" },
        { label: "파이프라인" },
        { label: "파이프라인 실행" },
        { label: "app1-maven-build-pr-7a2b9", isBold: true },
      ]}
      title="파이프라인 실행 상세조회"
    >
      {/* Info Banner */}
      <div className="mx-8 mt-5 flex gap-5">
        {/* Left Main Overview Panel */}
        <div className="flex-1 bg-white rounded-lg shadow-[0px_0px_8px_#00000014] p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold text-[#111111] tracking-[-0.2px]">
                  app1-maven-build-pr-7a2b9
                </h2>
                <Badge variant="primary">Running</Badge>
              </div>
              <p className="text-[#555555] text-sm tracking-[-0.14px]">
                파이프라인 템플릿:{" "}
                <span className="font-semibold text-[#111111]">
                  build-maven-spring-boot-pipeline
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="md">
                <RefreshCw className="w-4 h-4 mr-1.5" />
                재실행
              </Button>
              <Button variant="primary-semi" size="md">
                <CircleDashed className="w-4 h-4 mr-1.5 fill-white text-[#0077ff]" />
                취소
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-8 py-4 px-6 bg-[#f4f6f8] rounded-md border border-[#e0e0e0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-[#555555]" />
              </div>
              <div>
                <p className="text-xs text-[#555555] mb-0.5">실행자</p>
                <p className="text-sm font-medium text-[#111111]">홍길동</p>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-[#d0d0d0]" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <GitCommit className="w-4 h-4 text-[#555555]" />
              </div>
              <div>
                <p className="text-xs text-[#555555] mb-0.5">트리거 커밋</p>
                <p className="text-sm font-medium text-[#0077ff] hover:underline cursor-pointer">
                  7a2b9c3 (Fix user auth)
                </p>
              </div>
            </div>

            <div className="w-[1px] h-8 bg-[#d0d0d0]" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Clock className="w-4 h-4 text-[#555555]" />
              </div>
              <div>
                <p className="text-xs text-[#555555] mb-0.5">실행 시간</p>
                <p className="text-sm font-medium text-[#111111]">
                  1m 45s (진행 중)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Graph & Tasks */}
      <div className="mx-8 mt-5">
        <div className="bg-white rounded-lg shadow-[0px_0px_8px_#00000014] overflow-hidden">
          <Tabs
            items={[
              { id: "graph", label: "파이프라인 그래프" },
              { id: "yaml", label: "매니페스트 (YAML)" },
            ]}
            activeId="graph"
            className="px-6 pt-4 border-b border-[#e0e0e0]"
          />

          <div className="p-6">
            {/* Visual Graph container */}
            <div className="relative mb-10 py-8 px-12 bg-[#fafbfc] rounded-lg border border-[#e2e8f0] flex items-center justify-between">
              {/* Connective Line Background */}
              <div className="absolute top-[50%] left-16 right-16 h-1 bg-[#e2e8f0] -translate-y-[50%] z-0" />
              {/* Progress Line */}
              <div
                className="absolute top-[50%] left-16 h-1 bg-[#0077ff] -translate-y-[50%] z-0 transition-all"
                style={{ width: "60%" }}
              />

              {pipelineStages.map((stage) => (
                <div
                  key={stage.id}
                  className="relative z-10 flex flex-col items-center gap-3"
                >
                  {/* Node Circle */}
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-4 ${
                      stage.status === "success"
                        ? "bg-white border-[#00b30e]"
                        : stage.status === "running"
                          ? "bg-[#0077ff] border-[#c0dfff] shadow-[0_0_0_4px_#e5f1ff]"
                          : "bg-white border-[#e0e0e0]"
                    }`}
                  >
                    {stage.status === "success" && (
                      <CheckCircle2 className="w-6 h-6 text-[#00b30e]" />
                    )}
                    {stage.status === "running" && (
                      <Activity className="w-6 h-6 text-white animate-pulse" />
                    )}
                    {stage.status === "pending" && (
                      <Box className="w-5 h-5 text-[#aaaaaa]" />
                    )}
                  </div>

                  {/* Node Label */}
                  <div className="text-center">
                    <p
                      className={`text-sm font-bold tracking-[-0.14px] ${
                        stage.status === "pending"
                          ? "text-[#888888]"
                          : "text-[#111111]"
                      }`}
                    >
                      {stage.name}
                    </p>
                    <p className="text-xs text-[#555555] mt-0.5">
                      {stage.duration}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub UI Split: Task List & Logs */}
            <div className="flex gap-5 h-[400px]">
              {/* Task List */}
              <div className="w-[300px] border border-[#e0e0e0] rounded-lg flex flex-col bg-white">
                <div className="px-4 py-3 border-b border-[#e0e0e0] bg-[#f9fafb] font-semibold text-sm text-[#111111]">
                  실행 단계 목록
                </div>
                <div className="flex-1 overflow-auto py-2">
                  {pipelineStages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#f4f6f8] ${
                        stage.status === "running"
                          ? "bg-[#e5f1ff] border-l-4 border-[#0077ff]"
                          : "border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {stage.status === "success" && (
                          <CheckCircle2 className="w-4 h-4 text-[#00b30e]" />
                        )}
                        {stage.status === "running" && (
                          <RefreshCw className="w-4 h-4 text-[#0077ff] animate-spin" />
                        )}
                        {stage.status === "pending" && (
                          <CircleDashed className="w-4 h-4 text-[#aaaaaa]" />
                        )}
                        <span
                          className={`text-sm font-medium tracking-tight ${
                            stage.status === "pending"
                              ? "text-[#888888]"
                              : "text-[#333333]"
                          }`}
                        >
                          {stage.name}
                        </span>
                      </div>
                      <span className="text-xs text-[#888888]">
                        {stage.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logs Window */}
              <div className="flex-1 border border-[#e0e0e0] rounded-lg flex flex-col bg-[#1e1e1e] overflow-hidden">
                <div className="px-4 py-2 border-b border-[#333333] bg-[#252526] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-[#cccccc]" />
                    <span className="text-[#cccccc] text-xs font-medium tracking-wide font-mono">
                      Maven Build & Test - Logs
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-[#cccccc] hover:text-white p-1 rounded">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button className="text-[#cccccc] hover:text-white p-1 rounded">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 p-4 overflow-auto bg-[#1e1e1e]">
                  <pre className="text-[#d4d4d4] font-mono text-[13px] leading-relaxed whitespace-pre-wrap">
                    {logs}
                    <span className="animate-pulse">_</span>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CcpDashboardLayout>
  );
}
