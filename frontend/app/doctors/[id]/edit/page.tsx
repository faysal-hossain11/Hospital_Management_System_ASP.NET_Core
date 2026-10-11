
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type DoctorForm = {
  name: string;
  specialization: string;
  phone: string;
};

export default function EditDoctorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState<DoctorForm>({
    name: "",
    specialization: "",
    phone: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDoctor() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/Doctors/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to load doctor: ${response.status}`);
        }

        const doctor = await response.json();

        setForm({
          name: doctor.name ?? "",
          specialization: doctor.specialization ?? "",
          phone: doctor.phone ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load doctor."
        );
      } finally {
        setPageLoading(false);
      }
    }

    if (id) {
      loadDoctor();
    }
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        throw new Error("API URL is not configured.");
      }

      const response = await fetch(`${apiUrl}/Doctors/${id}`, {
        method: "PUT",
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
          `Update failed: ${response.status}`
        );
      }

      router.push("/doctors");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update doctor."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500";

  if (pageLoading) {
    return <main className="p-10">Loading doctor...</main>;
  }

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
          Edit Doctor
        </h1>

        {error && (
          <p role="alert" className="mt-4 text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow-sm"
        >
          <div>
            <label htmlFor="name" className="font-medium">
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
            <label htmlFor="specialization" className="font-medium">
              Specialization
            </label>
            <input
              id="specialization"
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={100}
            />
          </div>

          <div>
            <label htmlFor="phone" className="font-medium">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Doctor"}
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
