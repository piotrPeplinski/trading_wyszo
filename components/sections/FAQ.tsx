"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/content/site-content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionAurora } from "@/components/ui/SectionAurora";

export function FAQ() {
  return (
    <section id="faq" className="relative overflow-hidden py-[2.1875rem] sm:py-24">
      <SectionAurora variant="left" />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title="Najczęstsze pytania."
          description="Wszystko, czego potrzebujesz, żeby podjąć świadomą decyzję."
        />

        <Accordion.Root type="single" collapsible className="mt-8 flex flex-col gap-3 sm:mt-12">
          {faqs.map((faq, i) => (
            <Accordion.Item
              key={faq.question}
              value={`item-${i}`}
              className="overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-ink sm:text-base">
                  {faq.question}
                  <ChevronDown
                    size={18}
                    className="shrink-0 text-muted transition-transform duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:text-green-ink"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden px-6 text-sm leading-relaxed text-muted data-[state=open]:pb-4 data-[state=open]:animate-[accordion-down_0.25s_ease-out] data-[state=closed]:animate-[accordion-up_0.25s_ease-out]">
                {faq.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
