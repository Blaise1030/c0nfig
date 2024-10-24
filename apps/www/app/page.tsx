import { DemoSection } from "@/components/demo/cli-demo-section/demo-section";
import { PieChartIcon, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import BaseLayout from "@/layout/BaseLayout";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Github } from "@/components/icons/Github";

export default function Home() {
  return (
    <BaseLayout>
      <div className="flex flex-col">
        <div className="flex flex-col py-8 gap-2 min-h-dvh">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-row gap-2 items-center">
              <Link
                className={cn(buttonVariants({ variant: "link" }), "p-0")}
                href={`/docs${page_routes[0].href}`}
              >
                <PieChartIcon size={18} className="me-1" />
                npx k0nfig@latest
                <ArrowRight className="ms-2" size={14} />
              </Link>
            </div>
            <div className="flex flex-col space-y-1">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight max-w-6xl">
                c0nfig is a CLI tool for developers to run custom, reusable configurations.
              </h1>
              <p className="text-md max-w-lg text-muted-foreground">
                Developers can create remote JSON config and execute them via c0nfig CLI to speed up workflows.
              </p>
            </div>
            <div className="flex flex-row gap-2">
              <Link
                href={`/docs${page_routes[0].href}`}
                className={cn(buttonVariants({ size: "sm" }), "w-fit")}
              >
                Get started
              </Link>
              <Link
                href={`https://github.com/Blaise1030/kmdrr`}
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-fit"
                )}
              >
                <Github />
                Github
              </Link>
            </div>
          </div>
          <DemoSection />
        </div>
        <div>
          How it works
        </div>
      </div>

    </BaseLayout>
  );
}
