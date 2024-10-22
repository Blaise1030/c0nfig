import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EachRoute } from "@/lib/routes-config";
import React from "react";
import { ReactElement } from "react";
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Authors } from "@/app/blog/[slug]/page";
import { Logo } from "@/components/layouts/navbar";
import SubLink from "@/components/layouts/sublink";
import { db } from "@/be/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DocumentationBlock } from "@/components/modules/registry/documentation-block";

export default async function Layout({
  children,
  ...remaining
}: {
  children: ReactElement;
}) {

  const groupId = decodeURIComponent(((remaining as any).params as any)?.groupId.replace(/\+/g, '%20'));
  const paramsId = decodeURIComponent(((remaining as any).params as any)?.id.replace(/\+/g, '%20'));

  if (!groupId || !paramsId) redirect('/404')

  const templates = await db.query.templates.findFirst({
    with: { author: true },
    where: (p) => eq(p.slug, groupId as string)
  })

  if (!templates) redirect('/404')

  return (
    <React.Fragment>
      <div className="mx-auto top-0 w-full z-20 mb-4">
        <div className="mx-auto bg-background md:py-4 md:pt-8 py-5 backdrop-blur-sm flex gap-4 items-center">
          <div className="flex flex-col gap-4">
            <SheetLeftbar groupId={groupId} templates={templates?.commandItems} />
            <h1 className="text-3xl font-extrabold">
              {templates.title}
            </h1>
            <p className="text-muted-foreground -mt-4">
              {templates.description}
            </p>
            <Authors
              authors={[
                {
                  avatar: templates?.author?.image as string,
                  handleUrl: '#',
                  username: templates?.author?.name,
                  handle: templates?.author?.email,
                }
              ]}
            />
          </div>
        </div>
      </div>
      <div className="border-t sticky top-12 z-10" />
      <div className="flex items-start gap-8">
        <aside className="md:flex hidden flex-[1] min-w-[230px] sticky top-12 flex-col h-[94.5vh] overflow-y-auto border-e">
          <ScrollArea>
            <DocsMenu groupId={groupId} templates={templates?.commandItems} />
          </ScrollArea>
        </aside>
        <DocumentationBlock src={templates.commandItems.find(({ slug }) => slug === paramsId)?.url as string} />
      </div>
    </React.Fragment>
  );
}

export function SheetLeftbar({ groupId, templates }: { groupId: string, templates: { slug: string, title: string, description: string }[] }) {
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
            <DocsMenu isSheet groupId={groupId} templates={templates} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

async function DocsMenu({ isSheet = false, groupId, templates }: { isSheet?: boolean, groupId: string, templates: { slug: string, title: string, description: string }[] }) {
  return (
    <div className="flex flex-col gap-3.5 pr-2 pt-8 pb-6">
      {(
        [
          {
            title: "All Templates",
            noLink: true,
            items: templates?.map(({ title, slug }) => ({
              title,
              href: `/${slug}`,
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
            key={item.title + index}
            {...modifiedItems}
            href={`/registry/${groupId}`}
          />
        );
      })}
    </div>
  );
}
