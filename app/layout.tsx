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
      <body style={{minWidth: '369px', minHeight: '850px' }}>
      <AppUtilsProvider Children={children} />
      <Toaster />
        </body>
    </html>
  );
}
