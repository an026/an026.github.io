import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  // Static export can't fail the build over this (env vars are supplied at
  // deploy time, and this module also runs during the build's prerender
  // pass), but a clear console warning beats a silent, confusing 401.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see SETUP.md)."
    );
  }
}

// createClient throws synchronously on an empty URL, which would otherwise
// crash the build's prerender pass when env vars aren't set yet. Fall back
// to a syntactically valid placeholder — real requests still fail cleanly
// (caught by DataProvider) if this is actually deployed unconfigured.
export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true },
});
