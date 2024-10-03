import { DemoSection } from "@/components/demo-section";
import { buttonVariants } from "@/components/ui/button";
import { page_routes } from "@/lib/routes-config";
import { cn } from "@/lib/utils";
import { PieChartIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Home() {

  return (
    <div className="flex flex-col py-8 gap-2">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-row gap-2 items-center">
          <Link className={cn(buttonVariants({ variant: 'link' }), 'w-fit p-0')} href={`/ docs${page_routes[0].href}`}>
            <PieChartIcon size={18} className="me-2" />
            npx kmdrr@latest
            <ArrowRight className="ms-2" size={14} />
          </Link>
        </div>
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Streamlined CLI for reusable, customizable project setups.
          </h1>
          <p className="text-md max-w-lg text-muted-foreground">
            Effortless Configurations, Endless Possibilities
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <Link
            href={`/ docs${page_routes[0].href}`}
            className={cn(buttonVariants({ size: 'sm' }), 'w-fit')}
          >
            Get started
          </Link>
          <Link
            href={`/ docs${page_routes[0].href}`}
            className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'w-fit')}
          >
            Github
          </Link>
        </div>
      </div>
      <svg className="absolute inset-0 -z-10 h-full w-full stroke-border/50 dark:stroke-border/70 [mask-image:radial-gradient(100%_100%_at_center_center,white,transparent)]" aria-hidden="true">
        <defs>
          <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="50%" y="-1" patternUnits="userSpaceOnUse">
            <path d="M100 200V.5M.5 .5H200" fill="none" />
          </pattern>
        </defs>
        <svg x="50%" y="-1" className="overflow-visible fill-border/20">
          <path d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z" stroke-width="0" />
        </svg>
        <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
      </svg>

      <DemoSection />
    </div >
  );
}

