import { AlertTriangle, Database } from "lucide-react";
import { isFirebaseConfigured, missingFirebaseKeys, useLocalDemo } from "../../firebase/config.js";

export default function FirebaseNotice() {
  if (isFirebaseConfigured) {
    return (
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Database className="h-4 w-4" /> Firebase connected
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-space-pink/30 bg-space-pink/10 px-4 py-3 text-sm text-white">
      <span className="inline-flex items-center gap-2 font-semibold text-space-pink">
        <AlertTriangle className="h-4 w-4" /> Firebase env missing
      </span>
      <p className="mt-2 leading-5 text-white/80">
        Fill `.env` with your Firebase web app config, then restart with `npm.cmd run dev`.
        {useLocalDemo ? " Local demo mode is enabled." : " Writes are blocked until Firebase is configured."}
      </p>
      <p className="mt-2 text-xs text-space-muted">Missing: {missingFirebaseKeys.join(", ")}</p>
    </div>
  );
}
