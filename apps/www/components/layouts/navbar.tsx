'use client'

import Link from "next/link";
import { buttonVariants } from "../ui/button";
import Search from "../common/search";
import Anchor from "../anchor";
import { SheetLeftbar } from "./leftbar";
import { page_routes } from "@/lib/routes-config";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../common/theme-provider/theme-toggle";

export const NAVLINKS = [
  {
    title: "Registry",
    href: "/registry",
  },
  {
    title: "Documentation",
    href: `/docs${page_routes[0].href}`,
  },
  {
    title: "Blog",
    href: "/blog",
  },
  {
    title: "Tools",
    href: "/tools",
  },
];

export function Navbar() {
  return (
    <nav className="w-full h-12 sticky top-0 z-50 bg-background/70 backdrop-blur-sm">
      <div className="sm:container mx-auto w-[95vw] h-full flex items-center justify-between md:gap-2">
        <div className="flex items-center md:gap-5">
          <SheetLeftbar />
          <div className="flex items-center md:gap-6">
            <div className="sm:flex hidden">
              <Logo />
            </div>
            <div className="lg:flex hidden items-center gap-4 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search />
            <div className="flex ml-2.5 sm:ml-0 items-center gap-1">
              {/* <Link
                href="/login"
                className={cn(buttonVariants({
                  variant: "default",
                  size: 'sm',
                }), 'h-8')}
              >
                Sign In
              </Link> */}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <h2 className="text-md font-bold font-code">c0nfig.</h2>
    </Link>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="!text-primary md:font-semibold font-medium"
            absolute
            className="flex items-center gap-1 dark:text-stone-300/85 text-stone-800"
            href={item.href}
          >
            {item.title}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
