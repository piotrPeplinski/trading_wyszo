import Image from "next/image";
import { Mail } from "lucide-react";
import { site, riskDisclaimer } from "@/content/site-content";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-soft">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between sm:gap-10">
          <div className="max-w-sm">
            <a href="#top" className="flex items-center">
              <Image
                src="/jw-logo-mark.png"
                alt={site.brand}
                width={190}
                height={260}
                className="h-10 w-auto"
              />
            </a>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {site.tagline} — {site.community}. Uczymy samodzielnej analizy rynku, nie
              sprzedajemy sygnałów.
            </p>
            <div className="mt-5 flex items-center gap-4 text-sm text-muted">
              <a
                href={site.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 transition-colors hover:text-green-ink"
              >
                <InstagramIcon size={16} /> {site.contact.instagram}
              </a>
              <a
                href={`mailto:${site.contact.email}`}
                className="flex items-center gap-1.5 transition-colors hover:text-green-ink"
              >
                <Mail size={16} /> {site.contact.email}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold text-ink">Nawigacja</h4>
              <ul className="flex flex-col gap-2">
                {site.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="text-sm text-muted transition-colors hover:text-green-ink"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-semibold text-ink">Prawne</h4>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="/regulamin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-green-ink"
                  >
                    Regulamin
                  </a>
                </li>
                <li>
                  <a
                    href="/polityka-prywatnosci"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-green-ink"
                  >
                    Polityka prywatności
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 sm:mt-10">
          <p className="text-xs leading-relaxed text-muted-2">{riskDisclaimer}</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-muted-2">
              © {new Date().getFullYear()} {site.brand}. Wszelkie prawa zastrzeżone.
            </p>
            <a
              href="https://www.linkedin.com/in/peplinski/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium"
            >
              <LinkedinIcon size={14} className="icon-shimmer shrink-0" />
              <span className="text-shimmer">Designed &amp; developed by Piotr Pepliński</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
