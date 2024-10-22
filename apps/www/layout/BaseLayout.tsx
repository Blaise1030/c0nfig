import { Footer } from "@/components/layouts/footer";
import { Navbar } from "@/components/layouts/navbar";
import { ReactElement } from "react";

export default function BaseLayout({ children }: { children: ReactElement }) {
  return <>
    <Navbar />
    <main className="sm:container mx-auto px-6 h-auto">
      {children}
    </main>
    <Footer />
  </>
}