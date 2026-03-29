import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CS464 Project",
  description: "Yet-to-be-named project for cs464",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
