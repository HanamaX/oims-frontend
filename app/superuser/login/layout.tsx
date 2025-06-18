"use client";

import { Suspense } from "react";

export default function SuperuserLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      {children}
    </Suspense>
  );
}
