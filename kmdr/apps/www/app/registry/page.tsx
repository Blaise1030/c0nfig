import { TemplatesFilter } from "@/components/templates-filter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author, BlogMdxFrontmatter, getAllBlogs } from "@/lib/markdown";
import { formatDate2, stringToDate } from "@/lib/utils";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AriaDocs - Blog",
};

export default async function BlogIndexPage() {
  const blogs = (await getAllBlogs()).sort(
    (a, b) =>
      stringToDate(b.frontmatter.date).getTime() -
      stringToDate(a.frontmatter.date).getTime()
  );
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
        <div className="flex md:flex-row flex-col gap-8 items-start">
          <div className="min-w-[250px]">
            <TemplatesFilter />
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 mb-5">
            {blogs.map((blog) => (
              <BlogCard {...blog.frontmatter} slug={blog.slug} key={blog.slug} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogCard({
  date,
  title,
  description,
  slug,
  authors,
}: BlogMdxFrontmatter & { slug: string }) {
  return (
    <Link
      href={`/registry/${slug}/12`}
      className="flex flex-col gap-2 items-start border rounded-md py-5 px-3"
    >
      <h3 className="text-md font-semibold -mt-1 pr-7">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      <div className="flex items-center justify-between w-full mt-auto">
        <p className="text-[13px] text-muted-foreground">
          Published on {formatDate2(date)}
        </p>
        <AvatarGroup users={authors} />
      </div>
    </Link>
  );
}

export function AvatarGroup({
  users,
  max = 4,
}: {
  users: Author[];
  max?: number;
}) {
  const displayUsers = users.slice(0, max);
  const remainingUsers = Math.max(users.length - max, 0);

  return (
    <div className="flex items-center">
      {displayUsers.map((user, index) => (
        <Avatar
          key={user.username}
          className={`inline-block border-2 w-9 h-9 border-background ${index !== 0 ? "-ml-3" : ""
            } `}
        >
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      ))}
      {remainingUsers > 0 && (
        <Avatar className="-ml-3 inline-block border-2 border-background hover:translate-y-1 transition-transform">
          <AvatarFallback>+{remainingUsers}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
