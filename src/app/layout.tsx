import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yahoo! Messenger — Classic",
  description: "A faithful web recreation of Yahoo! Messenger 9 (2008): buddy list, IMs, emoticons, Audibles and the legendary BUZZ!!",
  keywords: ["Yahoo Messenger", "YM 9", "nostalgia", "instant messaging", "2000s"],
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Ccircle cx='8' cy='8' r='7.4' fill='%236D3FA8'/%3E%3Ctext x='8' y='11.8' text-anchor='middle' font-family='Georgia,serif' font-weight='bold' font-style='italic' font-size='10' fill='white'%3EY!%3C/text%3E%3C/svg%3E",
  },
  openGraph: {
    title: "Yahoo! Messenger — Classic",
    description: "The purple legend, reborn in your browser. BUZZ!!!",
    siteName: "Yahoo! Messenger Classic",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" style={{ overflow: "hidden" }}>
        {children}
      </body>
    </html>
  );
}
