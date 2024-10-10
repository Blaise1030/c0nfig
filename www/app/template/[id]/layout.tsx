import { Typography } from "@/components/typography";
import { ReactElement } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { EachRoute, ROUTES } from "@/lib/routes-config";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import SubLink from "@/components/sublink";

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
        <h3 className="font-semibold text-sm">On this page</h3>
        <ScrollArea className="pb-4 pt-0.5">
          <div className="flex flex-col gap-2.5 text-sm dark:text-neutral-300/85 text-neutral-800 ml-0.5">
            {[{ href: "", level: 0, text: "hello" }].map(
              ({ href, level, text }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn({
                    "pl-0": level == 2,
                    "pl-4": level == 3,
                    "pl-8 ": level == 4,
                  })}
                >
                  {text}
                </Link>
              )
            )}
          </div>
        </ScrollArea>
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

