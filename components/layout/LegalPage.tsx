import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionAurora } from "@/components/ui/SectionAurora";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="relative flex-1 overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
        <SectionAurora variant="left" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
          <div
            className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-muted sm:mt-10 sm:text-base
              [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-ink [&_h2]:sm:text-xl
              [&_p]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-ink
              [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:list-disc [&_ul]:pl-5
              [&_ul_ul]:mt-2 [&_a]:text-green-ink [&_a]:underline [&_a]:underline-offset-2 [&_a]:transition-colors [&_a]:hover:text-ink"
          >
            {children}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
