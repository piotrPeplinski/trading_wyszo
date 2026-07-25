import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { SectionAurora } from "@/components/ui/SectionAurora";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-20">
          <SectionAurora variant="left" />
          <div className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 text-center sm:px-6">
            <Badge>Błąd 404</Badge>
            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.1] text-ink sm:text-6xl">
              Ta strona zeszła z rynku.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Adres, którego szukasz, nie istnieje albo został przeniesiony. Wróć na stronę
              główną i znajdź to, czego potrzebujesz.
            </p>
            <Link href="/" className={buttonClasses("primary", "lg", "mt-8")}>
              <ArrowLeft size={18} /> Wróć na stronę główną
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
