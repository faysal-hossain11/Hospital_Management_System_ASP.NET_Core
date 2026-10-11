
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewDoctorPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    specialization: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${apiUrl}/Doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        const validationMessage = result?.errors
          ? Object.values(result.errors).flat().join(" ")
          : "";

        throw new Error(
          validationMessage ||
          result?.message ||
          result?.title ||
          `Failed to create doctor (${response.status}).`
        );
      }

      router.push("/doctors");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500";

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/doctors"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Doctors
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-800">
          Add New Doctor
        </h1>

        <p className="mt-2 text-slate-500">
          Enter the doctor's information below.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="name" className="font-medium text-slate-700">
              Doctor Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="specialization"
              className="font-medium text-slate-700"
            >
              Specialization
            </label>
            <input
              id="specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Cardiology"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="phone" className="font-medium text-slate-700">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={20}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Doctor"}
            </button>

            <Link
              href="/doctors"
              className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
