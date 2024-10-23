import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EachRoute } from "@/lib/routes-config";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton"
import {
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetClose,
  Sheet,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Logo } from "@/components/layouts/navbar";
import SubLink from "@/components/layouts/sublink";
import { db } from "@/be/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { DocumentationBlock } from "@/components/modules/registry/documentation-block";
import Authors from "@/components/common/author";

export default async function Layout(props: any) {

  const groupId = decodeURIComponent(((props as any).params as any)?.groupId.replace(/\+/g, '%20'));
  const paramsId = decodeURIComponent(((props as any).params as any)?.id.replace(/\+/g, '%20'));

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
        <Suspense fallback={<DocsLoadingComponent />}>
          <DocumentationBlock src={templates.commandItems.find(({ slug }) => slug === paramsId)?.url as string} />
        </Suspense>
      </div>
    </React.Fragment>
  );
}

function DocsLoadingComponent() {
  return (
    <div className="flex items-start gap-10 flex-[5.45]">
      <div className="flex-[4.5] pt-8 pb-10 flex flex-col gap-2">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-12 w-[50%]" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-6 w-[80%]" />
            <Skeleton className="h-6 w-[90%]" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12 rounded-md" />
          <Skeleton className="h-4 w-12 rounded-md" />
        </div>
        <div className="flex gap-2 mt-12">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex gap-6 flex-col">
          <div className="gap-2 flex flex-col">
            <Skeleton className="h-8 w-[60%]" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="gap-2 flex flex-col">
            <Skeleton className="h-8 w-[90%]" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="gap-2 flex flex-col">
            <Skeleton className="h-8 w-[50%]" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
      <div className="lg:flex hidden toc flex-[1.5] min-w-[238px] py-8 sticky top-16 h-[95.95vh]">
        <div className="flex flex-col gap-3 w-full pl-2 text-center">
          <div>
            <Skeleton className="h-32 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SheetLeftbar({ groupId, templates }: { groupId: string, templates: { slug: string, title: string, description: string }[] }) {
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
