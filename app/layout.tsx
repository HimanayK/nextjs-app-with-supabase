import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import { AppUtilsProvider } from "@/context/AppUtils";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Next.js Supabase CRUD Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <AppUtilsProvider Children={children} />
      <Toaster />
        </body>
    </html>
  );
}
