
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", href: "/" },
  { label: "Patients", href: "/patients" },
  { label: "Doctors", href: "/doctors" },
  { label: "Appointments", href: "/appointments" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 bg-slate-900 p-5 text-white md:min-h-screen md:w-64">
      <h1 className="mb-8 text-xl font-bold">
        MediCare Admin
      </h1>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg p-3 transition ${
                active
                  ? "bg-blue-600"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
