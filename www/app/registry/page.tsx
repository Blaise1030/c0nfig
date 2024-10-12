import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Templates() {
  const templates = [
    {
      title: "Drizzle ORM & Drizzle Kit",
      description: "Setup Drizzle ORM & Drizzle Kit to your project.",
      href: "/registry/1",
      id: 1,
    },
  ];
  return (
    <div>
      <div className="flex flex-col py-12">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Check out some templates
          </h1>
          <p className="text-md max-w-lg text-muted-foreground">
            Check these templates and get your project started with these
            configurations.
          </p>
        </div>
      </div>
      <section className="grid grid-cols-3 gap-4 col-span-9">
        {templates?.map(({ title, description, href, id }) => (
          <Card className="cols-span-1" key={id}>
            <CardHeader className="p-4">
              <CardTitle className="text-md">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardFooter className="p-4 border-t justify-between">
              <Badge className="w-fit rounded-sm">Free</Badge>
              <Link
                className={buttonVariants({ size: "sm", variant: "outline" })}
                href={href}
              >
                Read Documentation <ArrowRight className="size-4 ms-2" />
              </Link>
            </CardFooter>
          </Card>
        ))}
      </section>
    </div>
  );
}
