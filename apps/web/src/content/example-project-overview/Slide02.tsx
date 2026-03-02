import { Heading, BulletList, Callout } from "@shared/ui/components/text";

export default function Slide02() {
  return (
    <div className="space-y-6">
      <Heading level={2} content="핵심 기능" />
      <BulletList
        ordered={false}
        items={[
          "실시간 협업 편집 기능",
          "AI 기반 문서 자동 생성",
          "버전 관리 및 히스토리 추적",
          "팀 권한 관리 시스템",
        ]}
      />
      <Callout
        variant="tip"
        title="핵심 차별점"
        content="파일 시스템 기반 아키텍처로 Vite HMR을 통한 즉시 반영이 가능합니다."
      />
    </div>
  );
}
