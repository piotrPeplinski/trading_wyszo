"use client";

import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/components/reusable/AuthProvider";
import { JournalNav } from "@/components/reusable/JournalNav";
import { SessionGate } from "@/components/reusable/SessionGate";
import { Toasts } from "@/components/reusable/Toasts";
import { TradeDialogProvider } from "@/components/reusable/TradeDialog";

type JournalLayoutProps = {
  children: React.ReactNode;
};

const JournalLayout = ({ children }: JournalLayoutProps) => (
  <AuthProvider>
    <SessionGate>
      {/* One dialog instance for the whole journal, so nav, list and calendar
          all open the same thing. No Footer: this is the app, not a page. */}
      <TradeDialogProvider>
        <JournalNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <Toasts />
      </TradeDialogProvider>
    </SessionGate>
  </AuthProvider>
);

export default JournalLayout;
