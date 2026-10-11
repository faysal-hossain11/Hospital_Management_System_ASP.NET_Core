
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Doctor = {
    id: number;
    name: string;
    specialization: string;
    phone: string;
};

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchDoctors() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                if (!apiUrl) {
                    throw new Error("API URL is not configured.");
                }

                const response = await fetch(`${apiUrl}/Doctors`);

                if (!response.ok) {
                    throw new Error(`Failed to load doctors: ${response.status}`);
                }

                const data: Doctor[] = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid doctor data received.");
                }

                setDoctors(data);
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

        fetchDoctors();
    }, []);


    async function handleDelete(id: number) {
        if (!window.confirm("Are you sure you want to delete this doctor?")) {
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                throw new Error("API URL is not configured.");
            }

            const response = await fetch(`${apiUrl}/Doctors/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status}`);
            }

            setDoctors((current) =>
                current.filter((doctor) => doctor.id !== id)
            );
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Failed to delete doctor."
            );
        }
    }


    return (
        <main className="min-h-screen p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                <Link
                    href="/"
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    ← Back to Dashboard
                </Link>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Doctors
                        </h1>
                        <p className="mt-2 text-slate-500">
                            View all registered doctors.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-700">
                            Total: {doctors.length}
                        </span>

                        <Link
                            href="/doctors/new"
                            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
                        >
                            + Add Doctor
                        </Link>
                    </div>

                </div>

                <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm">
                    {loading ? (
                        <p className="p-8 text-slate-500">Loading doctors...</p>
                    ) : error ? (
                        <p role="alert" className="p-8 text-red-600">
                            {error}
                        </p>
                    ) : doctors.length === 0 ? (
                        <p className="p-8 text-slate-500">
                            No doctors found.
                        </p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Doctor Name</th>
                                    <th className="p-4">Specialization</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {doctors.map((doctor) => (
                                    <tr
                                        key={doctor.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="p-4">{doctor.id}</td>
                                        <td className="p-4 font-medium text-slate-800">
                                            {doctor.name}
                                        </td>
                                        <td className="p-4">
                                            {doctor.specialization}
                                        </td>
                                        <td className="p-4">{doctor.phone}</td>

                                        <td className="whitespace-nowrap p-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/doctors/${doctor.id}/edit`}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(doctor.id)}
                                                    className="font-medium text-red-600 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </main>
    );
}
