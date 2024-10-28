import { AvatarGroup } from "@/components/common/avatar-group";
import { BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "c0nfig - Blog",
};

export default async function BlogIndexPage() {
  const blogs = (await getAllBlogs()).sort(
    (a, b) =>
      stringToDate(b.frontmatter.date).getTime() -
      stringToDate(a.frontmatter.date).getTime()
  );
  return (
    <div className="w-full mx-auto flex flex-col gap-1 sm:min-h-[91vh] min-h-[88vh] pt-2">
      <div className="mb-7 flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold">
          Mini tools from <span className="font-mono">c0nfig</span>.
        </h1>
        <p className="text-muted-foreground">
          Mini tools from c0nfig, that simplifies config creation.
        </p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-2 gap-4 mb-5 h-fit">
        {[{
          title: 'Code Block Serialiser & Deserialiser',
          description: 'Serialize your code blocks into a compact version for usage within a JSON object.',
          slug: '/tools/code-serialiser',
          cover: '/tools/code-serialiser.webp',
        }].map(({ title, description, slug, cover }: { cover: string, title: string, description: string, slug: string }) => (
          <ToolCards title={title} cover={cover} description={description} slug={slug} key={slug} />
        ))}
      </div>
    </div>
  );
}

function ToolCards({
  title,
  description,
  slug,
  cover,
}: { title: string, description: string, slug: string, cover: string }) {
  return (
    <Link
      href={slug}
      className="flex h-fit flex-col gap-4 items-start border rounded-md py-5 px-3"
    >
      <h3 className="text-md font-semibold -mt-1 pr-7">{title}</h3>
      <div className="w-full">
        <Image
          src={cover}
          alt={title}
          width={400}
          height={150}
          quality={80}
          className="w-full rounded-md object-cover h-[180px] border"
        />
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}

