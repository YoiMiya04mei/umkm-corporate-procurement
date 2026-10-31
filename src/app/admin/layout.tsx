import React from "react";

export const metadata = {
  title: "Admin Dashboard CMS | PT Mitra Karya Pratama",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-corporate-light-gray">{children}</div>;
}
