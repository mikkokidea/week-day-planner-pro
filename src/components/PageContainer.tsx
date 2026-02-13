import type { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-md mx-auto px-4 pt-5 pb-24">{children}</div>
  );
}
