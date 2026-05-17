import type { Metadata } from "next";
import "./globals.css";
import { Saira } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "leaflet/dist/leaflet.css";
import { AuthProvider } from "../context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { Header } from "@/components/homePage/Header";
import Head from "next/head";
const sairaFont = Saira({
  subsets: ["vietnamese"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "EVStation",
  description: "TÃ¬m kiáº¿m nhanh chÃ³ng tráº¡m sáº¡c quanh báº¡n",
  icons: {
    icon: "/appIcon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="stylesheet" href="/leaflet-routing-machine.css" />
        <script src="/leaflet-routing-machine.min.js" defer />
      </Head>
      <body className={`${sairaFont.className}`}>
        <AuthProvider>
          <main>
            {children}
            <AuthModal />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="light"
            />
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}

