"use client";

import { useState } from "react";
import { authClient } from "../../lib/auth-client";

export function BannedSignOut() {
  const [loading, setLoading] = useState(false);
  async function signOut() {
    setLoading(true);
    await authClient.signOut();
    window.location.assign("/");
  }
  return (
    <button type="button" onClick={signOut} disabled={loading} className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/5 disabled:opacity-50">
      {loading ? "Saindo..." : "Sair da conta"}
    </button>
  );
}
