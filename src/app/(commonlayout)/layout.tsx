// src/app/(commonlayout)/layout.tsx
import Header from "@/components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <main>{children}</main>
    </>
  );
}
