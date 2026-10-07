import "./globals.css";
import { Playfair_Display, Poppins } from "next/font/google";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";

const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display" });
const body = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-body" });

export const metadata = {
  title: "The Lovely Vault ✨",
  description: "Jewelry, watches, glasses & accessories",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={`${display.variable} ${body.variable} font-body bg-lilac-50 text-lilac-900`}>
        <Header />
        <main className="mx-auto max-w-6xl px-4 pb-24">{children}</main>
        <CartDrawer />
      </body>
    </html>
  );
}
