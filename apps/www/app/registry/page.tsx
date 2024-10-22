import { db } from "@/be/db";
import { AvatarGroup } from "@/components/common/avatar-group";
import { TemplatesFilter } from "@/components/templates-filter";
import { Author } from "@/lib/markdown";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AriaDocs - Blog",
};

export default async function BlogIndexPage() {
  const templates = await db.query.templates.findMany({
    limit: 9,
    with: { author: true }
  })

  return (
    <div className="flex flex-col items-start justify-center pt-8 pb-10 w-full mx-auto">
      <div className="w-full mx-auto flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
        <div className="mb-7 flex flex-col gap-2">
          <h1 className="text-3xl font-extrabold">
            Find your Template
          </h1>
          <p className="text-muted-foreground">
            Jumpstart your app development process with pre-built solutions from c0nfig and our community.
          </p>
        </div>
        <div className="flex md:flex-row flex-col gap-10 items-start">
          <div className="md:w-[256px] w-full">
            <TemplatesFilter />
          </div>
          <div className="w-full grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 mb-5">
            {templates?.map((template) => (
              <TemplateCard
                date={template?.updatedAt?.toDateString()}
                description={template?.description}
                commands={template?.commandItems}
                title={template?.title}
                slug={template?.slug}
                key={template?.id}
                authors={[{
                  avatar: template?.author?.image as string,
                  handleUrl: template?.author?.email,
                  username: template?.author?.name,
                  handle: template?.author?.email,
                }]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TemplateCard({ slug, date, title, description, authors, commands }: { authors: Author[], commands: { slug: string, title: string, description: string, url: string }[], slug: string, date: string, title: string, description: string }) {
  return <Link
    href={`/registry/${slug}/${commands[0]?.slug}`}
    className="flex flex-col w-full gap-2 items-start border rounded-md py-5 px-3"
  >
    <h3 className="text-md font-semibold -mt-1 pr-7">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="flex items-center justify-between w-full mt-auto">
      <p className="text-[13px] text-muted-foreground">
        Published on {date}
      </p>
      <AvatarGroup users={authors} />
    </div>
  </Link>
}
