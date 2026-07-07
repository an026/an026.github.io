import type { Metadata } from "next";
import "./globals.css";
import "@/components/ds/ds.css";

export const metadata: Metadata = {
  title: "Allison Vu",
  description: "Software engineer building AI-powered products and full-stack web apps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          // Runs before paint to avoid a flash of the wrong theme: mirrors the
          // logic in useTheme (localStorage override, else OS preference).
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("av-theme");if(!t)t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light";if(t==="dark")document.documentElement.setAttribute("data-theme","dark");}catch(e){}})();`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
