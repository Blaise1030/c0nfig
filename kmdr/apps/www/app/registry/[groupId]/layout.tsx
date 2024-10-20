import SubLink from "@/components/sublink";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EachRoute } from "@/lib/routes-config";
import React from "react";
import { ReactElement } from "react";
import { Logo } from "@/components/navbar";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { AvatarGroup } from "@/app/blog/page";
import { Authors } from "@/app/blog/[slug]/page";

const registry = [
  {
    id: 1,
    endpoint: "http://localhost:3000/cli/auth.json",
    title: "Initialize authentication",
  },
  {
    id: 2,
    endpoint: "http://localhost:3000/cli/auth-add.json",
    title: "Add new authentication",
  },
];

export default function Layout({
  children,
  ...remaining
}: {
  children: ReactElement;
}) {
  const groupId = remaining["params"]["groupId"];
  return (
    <React.Fragment>
      <div className="mx-auto top-0 w-full z-20 mb-4">
        <div className="mx-auto bg-background md:py-4 md:pt-8 py-5 backdrop-blur-sm flex gap-4 items-center">
          <div className="flex flex-col gap-4">
            <SheetLeftbar groupId={groupId} />
            <h1 className="text-3xl font-extrabold">
              The latest blogs of this product
            </h1>
            <p className="text-muted-foreground -mt-4">
              All the latest blogs and news, straight from the team.
            </p>
            <Authors
              authors={[
                {
                  handle: "Hello",
                  handleUrl: "@hello",
                  avatar: "",
                  username: "hello1",
                },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="border-t sticky top-12 z-10" />
      <div className="flex items-start gap-8">
        <aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-12 flex-col h-[94.5vh] overflow-y-auto border-e">
          <ScrollArea>
            <DocsMenu groupId={groupId} />
          </ScrollArea>
        </aside>
        {children}
      </div>
    </React.Fragment>
  );
}

export function SheetLeftbar({ groupId }: { groupId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          className="md:hidden flex w-fit rounded-2xl"
          size="sm"
        >
          <Menu className="mr-2 size-4" />
          More templates
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-4 px-0" side="left">
        <SheetHeader>
          <SheetClose className="px-5" asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto">
          <div className="mx-2 px-5">
            <DocsMenu isSheet groupId={groupId} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

async function DocsMenu({ isSheet = false, groupId }) {
  return (
    <div className="flex flex-col gap-3.5 pr-2 pt-8 pb-6">
      {(
        [
          {
            title: "All Templates",
            noLink: true,
            items: registry.map(({ title, id }) => ({
              title,
              href: `/${id}`,
            })),
          },
        ] as EachRoute[]
      ).map((item, index) => {
        const modifiedItems = {
          ...item,
          level: 0,
          isSheet,
        };
        return (
          <SubLink
            href={`/registry/${groupId}`}
            key={item.title + index}
            {...modifiedItems}
          />
        );
      })}
    </div>
  );
}
