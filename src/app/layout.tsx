import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ossama Elhakki | AI Engineer & ML Systems Builder",
  description:
    "AI Engineer specializing in machine learning, computer vision, NLP, and AI automation agents. Based in Morocco. Available for remote positions and freelance.",
};

// Runs BEFORE React — sets data-theme, dir, and lang on <html> instantly.
// Reads theme from localStorage, locale from the URL path.
// Stores both in cookies so the server can render the right dir on next request.
const INIT_SCRIPT = `(function(){try{
  var d=document.documentElement;
  var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');
  d.setAttribute('data-theme',t);
  document.cookie='theme='+t+';path=/;max-age=31536000;SameSite=Lax';
  var loc=(window.location.pathname.split('/')[1]||'en');
  if(loc==='ar'||loc==='en'||loc==='fr'){
    d.lang=loc;
    d.dir=loc==='ar'?'rtl':'ltr';
    document.cookie='locale='+loc+';path=/;max-age=31536000;SameSite=Lax';
  }
  d.classList.add('theme-init');
  requestAnimationFrame(function(){requestAnimationFrame(function(){d.classList.remove('theme-init');});});
}catch(e){}})();`;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const theme      = (cookieStore.get("theme")?.value  ?? "dark") as "dark" | "light";
  // Drive lang/dir from the real request locale (URL), not a lagging cookie,
  // so the entire layout renders RTL on the server for Arabic.
  const locale = await getLocale();
  const isRtl  = locale === "ar";

  return (
    <html
      lang={locale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`h-full ${inter.variable} ${cairo.variable}`}
      data-theme={theme}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ backgroundColor: "var(--bg-main)", color: "var(--text-primary)" }}
      >
        {children}
      </body>
    </html>
  );
}
