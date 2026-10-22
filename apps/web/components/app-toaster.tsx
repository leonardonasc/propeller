"use client";

import { Toaster } from "sonner";

export default function AppToaster() {
  return <Toaster position="bottom-right" theme="system" richColors toastOptions={{ classNames: { toast: "!border-border !bg-card !text-card-foreground", title: "!text-card-foreground", description: "!text-muted-foreground", success: "!border-success/40", error: "!border-danger/40" } }} />;
}
