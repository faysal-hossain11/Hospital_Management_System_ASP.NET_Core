
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NewPatientPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        setLoading(true);
        setError("");

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                throw new Error("API URL is not configured.");
            }

            const response = await fetch(`${apiUrl}/Patients`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    age: Number(form.age),
                }),
            });

            if (!response.ok) {
                const result = await response.json().catch(() => null);

                throw new Error(
                    result?.message ??
                    result?.title ??
                    "Could not create patient. Check the required fields."
                );
            }

            router.push("/patients");
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

    const fieldClass =
        "mt-1 w-full rounded-lg border border-slate-300 p-3 outline-none focus:border-blue-500";

    return (
        <main className="min-h-screen bg-slate-50 p-6 text-slate-900 md:p-10">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/patients"
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                >
                    ← Back to Patients
                </Link>

                <h1 className="mt-6 text-3xl font-bold text-slate-900">
                    Add New Patient
                </h1>

                <p className="mt-2 text-slate-600">
                    Enter the patient's information below.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-md"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block font-semibold text-slate-800"
                        >
                            Full Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="age"
                                className="mb-2 block font-semibold text-slate-800"
                            >
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
                                className={fieldClass}
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="gender"
                                className="mb-2 block font-semibold text-slate-800"
                            >
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className={fieldClass}
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="phone"
                            className="mb-2 block font-semibold text-slate-800"
                        >
                            Phone
                        </label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={form.phone}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                            maxLength={20}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="address"
                            className="mb-2 block font-semibold text-slate-800"
                        >
                            Address
                        </label>
                        <input
                            id="address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            className={fieldClass}
                            required
                            maxLength={200}
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Patient"}
                        </button>

                        <Link
                            href="/patients"
                            className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
