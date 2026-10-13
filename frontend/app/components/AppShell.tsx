
"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";

export default function AppShell({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);
  const [validatedPath, setValidatedPath] = useState<string | null>(null);

  useEffect(() => {
    if (pathname === "/login") {
      setAuthenticated(false);
      setValidatedPath(pathname);
      return;
    }

    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      setAuthenticated(false);
      setValidatedPath(pathname);
      router.replace("/login");
      return;
    }

    setAuthenticated(true);
    setValidatedPath(pathname);
  }, [pathname, router]);

  // Login page should not display the dashboard sidebar.
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Avoid displaying a protected page before checking the token.
  if (validatedPath !== pathname || !authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Checking authentication...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
