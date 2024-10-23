import { Leftbar } from "@/components/layouts/leftbar";
import BaseLayout from "@/layout/BaseLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "c0nfig - Blog",
};


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
