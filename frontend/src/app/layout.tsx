import type { Metadata } from "next";
import "./globals.css";
import { ApolloWrapper } from "@/components/ApolloWrapper";
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
      <body>
        <ApolloWrapper>
          {children}
        </ApolloWrapper>
      </body>
    </html>
  );
}
