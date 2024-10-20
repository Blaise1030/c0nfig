import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
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