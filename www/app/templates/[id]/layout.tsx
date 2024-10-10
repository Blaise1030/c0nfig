import { Typography } from "@/components/typography";
import { ReactElement } from "react";
import Toc from "@/components/toc";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function DocumentationSection({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <div className="flex items-start gap-14">
      <aside className="w-[230px] hidden md:block"></aside>
      <div className="flex-[4]">
        <div className="flex items-start gap-14">
          <div className="flex-[3] py-10">
            <Typography>
              <h1 className="text-3xl -mt-2">Title</h1>
              <p className="-mt-4 text-muted-foreground text-[16.5px]">
                Description
              </p>
              <div className="flex gap-1 -mt-2 mb-4">
                <Badge>Hello</Badge>
                <Badge>Hello</Badge>
              </div>

              <div className="w-full max-w-[65ch]">{children}</div>
            </Typography>
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
            {[].map(({ href, level, text }) => (
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
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
