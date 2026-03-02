import { Heading, Paragraph } from "@shared/ui/components/text";

export default function Slide01() {
  return (
    <div className="space-y-6">
      <Heading level={1} content="프로젝트 개요" />
      <Paragraph content="이 문서는 **SaaS 프로젝트**의 전체 기획을 담고 있습니다. 핵심 목표, 주요 기능, 그리고 실행 계획을 다룹니다." />
      <Paragraph content="Tino를 사용하면 외부 AI가 이런 슬라이드를 **자동으로 생성**할 수 있습니다." />
    </div>
  );
}
