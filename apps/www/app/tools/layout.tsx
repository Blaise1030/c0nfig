import BaseLayout from "@/layout/BaseLayout";
import { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout>
      <div className="flex flex-col items-start justify-center pt-8 pb-10 w-full mx-auto">
        {children}
      </div>
    </BaseLayout>
  );
}
