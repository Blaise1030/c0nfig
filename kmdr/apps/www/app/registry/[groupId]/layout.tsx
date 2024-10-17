import SubLink from "@/components/sublink";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EachRoute } from "@/lib/routes-config";
import { ReactElement } from "react";

const registry = [
  { id: 1, endpoint: 'http://localhost:3000/cli/auth.json', title: 'AuthJSON' },
  { id: 2, endpoint: 'http://localhost:3000/cli/auth-add.json', title: '1AuthJSON' },
]

export default function Layout({ children }: { children: ReactElement }) {
  return <div className="flex items-start gap-14">
    <aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-16 flex-col h-[94.5vh] overflow-y-auto">
      <ScrollArea className="py-4">
        <DocsMenu />
      </ScrollArea>
    </aside>
    {children}
  </div>
}

function DocsMenu({ isSheet = false }) {
  return (
    <div className="flex flex-col gap-3.5 mt-5 pr-2 pb-6">
      {(
        [
          {
            title: "All Templates",
            noLink: true,
            items: [
              { title: "Introduction", href: "/introduction" },
              { title: "Introduction", href: "/introduction" },
            ],
          },
        ] as EachRoute[]
      ).map((item, index) => {
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
