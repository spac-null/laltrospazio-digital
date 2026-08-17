import type { ReactNode } from "react";
import { Navigation } from "./Navigation";
import { SiteFooter } from "./SiteFooter";

export const SiteFrame = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border focus:border-signal-current focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
    >
      Vai al contenuto
    </a>
    <Navigation />
    <main id="main">{children}</main>
    <SiteFooter />
  </div>
);
