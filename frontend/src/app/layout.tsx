import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/components/ApolloWrapper";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Portfolio Dashboard",
  description: "Project R_1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <ApolloWrapper>
          <Breadcrumb />
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
