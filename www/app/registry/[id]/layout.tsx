
import { ReactElement } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EachRoute } from "@/lib/routes-config";
import { Badge } from "@/components/ui/badge";
import SubLink from "@/components/sublink";
import { CodeBlockWrapper } from "@/components/code-previewer";

export default function DocumentationSection({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <div className="flex items-start gap-14">
      <aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-16 flex-col h-[94.5vh] overflow-y-auto">
        <ScrollArea className="py-4">
          <DocsMenu />
        </ScrollArea>
      </aside>
      <div className="flex-[4]">
        <div className="flex items-start gap-14">
          <div className="flex-[3] py-10">
            <div className="mb-8 flex gap-2 flex-col">
              <h1 className="text-3xl font-bold">Title</h1>
              <p className="text-muted-foreground text-[16.5px]">
                Description
              </p>
              <Badge className="gap-2 bg-background w-fit" variant="outline">
                <div className="size-2 bg-green-400 animate-pulse rounded-full" />
                Schema Verified
              </Badge>
            </div>
            <div className="w-full max-w-[65ch]">{children}</div>
          </div>
        </div>
      </div>
      <DocumentationToC />
    </div>
  );
}

function DocumentationToC() {
  return (
    <div className="lg:flex hidden toc flex-[1] min-w-[230px] py-8 sticky top-16 h-[95.95vh]">
      <div className="flex flex-col gap-3 w-full pl-2">
        <h3 className="font-semibold text-sm">Run command with</h3>
        <CodeBlockWrapper>
          npx kmdrr@latest https://example.com/hello.json
        </CodeBlockWrapper>
      </div>
    </div>
  );
}


function DocsMenu({ isSheet = false }) {
  return (
    <div className="flex flex-col gap-3.5 mt-5 pr-2 pb-6">
      {([{ title: "All Templates", noLink: true, href: "/introduction", items: [{ title: "Introduction", href: "/introduction" }] }] as EachRoute[]).map((item, index) => {
        const modifiedItems = {
          ...item,
          href: `/docs${item.href}`,
          level: 0,
          isSheet,
        };
        return <SubLink key={item.title + index} {...modifiedItems} />;
      })}
    </div>
  );
}

