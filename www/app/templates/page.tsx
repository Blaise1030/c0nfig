import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import React from "react";

export default function Templates() {
  return (
    <React.Fragment>
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
        <Card className="cols-span-1">
          <CardHeader className="p-4">
            <CardTitle className="text-md">Drizzle ORM</CardTitle>
            <CardDescription>
              Setup Drizzle ORM to your project.
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4 border-t">
            <Button size={"sm"} variant={"outline"}>
              Read Documentation <ArrowRight className="size-4 ms-2" />
            </Button>
          </CardFooter>
        </Card>
        <Card className="cols-span-1">
          <CardHeader className="p-4">
            <CardTitle className="text-sm">Drizzle ORM</CardTitle>
            <CardDescription>
              Setup Drizzle ORM to your project.
            </CardDescription>
          </CardHeader>
          <CardFooter className="p-4">
            <Button size={"sm"} variant={"outline"}>
              Read Documentation <ArrowRight className="size-4 ms-2" />
            </Button>
          </CardFooter>
        </Card>
      </section>
    </React.Fragment>
  );
}
