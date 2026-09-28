"use client";

import React from "react";
import { X } from "lucide-react";

import { DialogClose } from "@/components/ui/dialog";

/**
 * Lives inside the dialog's sticky header rather than using DialogContent's own
 * button: that one is absolutely positioned inside the scroll container, so it
 * slides out of view as soon as a long form is scrolled.
 */
export const DialogCloseButton = () => (
  <DialogClose
    aria-label="Zamknij"
    className="ml-auto shrink-0 rounded-full p-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-green/40 focus-visible:outline-hidden"
  >
    <X size={18} />
  </DialogClose>
);
