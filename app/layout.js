import "./globals.css";

import { SiteHeader } from "@/components/SiteHeader";

export const metadata = {
  title: "Daker Hub",
  description: "Vercel and Supabase ready hackathon portal with shared favorites, teams, and submission tracking."
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <SiteHeader />
        <main className="site-shell site-main">{children}</main>
      </body>
    </html>
  );
}
