import { Leftbar } from "@/components/leftbar";
import BaseLayout from "@/layout/BaseLayout";

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BaseLayout>
      <div className="flex items-start gap-10">
        <Leftbar key="leftbar" />
        <div className="flex-[5.25]">{children}</div>
      </div>
    </BaseLayout>
  );
}
