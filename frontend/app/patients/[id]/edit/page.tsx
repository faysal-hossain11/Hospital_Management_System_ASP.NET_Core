
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type PatientForm = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
};

export default function EditPatientPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [form, setForm] = useState<PatientForm>({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    address: "",
  });

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPatient() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/Patients/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to load patient: ${response.status}`);
        }

        const patient = await response.json();

        setForm({
          name: patient.name ?? "",
          age: String(patient.age ?? ""),
          gender: patient.gender ?? "Male",
          phone: patient.phone ?? "",
          address: patient.address ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load patient."
        );
      } finally {
        setPageLoading(false);
      }
    }

    if (id) {
      loadPatient();
    }
  }, [id]);

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
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

      const response = await fetch(`${apiUrl}/Patients/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          gender: form.gender,
          phone: form.phone,
          address: form.address,
        }),
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

      router.push("/patients");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update patient."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500";

  if (pageLoading) {
    return <main className="p-10">Loading patient...</main>;
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/patients"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Patients
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-800">
          Edit Patient
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
              Full Name
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="age" className="font-medium">
                Age
              </label>
              <input
                id="age"
                name="age"
                type="number"
                min="0"
                max="130"
                value={form.age}
                onChange={handleChange}
                className={inputClass}
                required
              />
            </div>

            <div>
              <label htmlFor="gender" className="font-medium">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
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

          <div>
            <label htmlFor="address" className="font-medium">
              Address
            </label>
            <input
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className={inputClass}
              required
              maxLength={200}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Patient"}
            </button>

            <Link
              href="/patients"
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
