import { Heading, Paragraph } from "@shared/ui/components/text";

export default function Slide01() {
  return (
    <div className="space-y-6">
      <Heading level={1} content="Title" />
      <Paragraph content="Content goes here." />
    </div>
  );
}
