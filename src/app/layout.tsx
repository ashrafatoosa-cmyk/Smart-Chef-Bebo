import type { Metadata } from "next";
import { Acme, Cookie } from "next/font/google";
import "./globals.css";

const acme = Acme({
  variable: "--font-acme",
  subsets: ["latin"],
  weight: ["400"],
});

const cookie = Cookie({
  variable: "--font-slogan",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "SmarterChef Bebo",
  description: "Turning leftovers into complete meals with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${acme.variable} ${cookie.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-white font-acme">
        {children}
      </body>
    </html>
  );
}
