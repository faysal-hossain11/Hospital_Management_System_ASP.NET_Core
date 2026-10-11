
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Appointment = {
    id: number;
    patientId: number;
    patientName: string;
    doctorId: number;
    doctorName: string;
    specialization: string;
    appointmentDate: string;
    status: string;
};

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchAppointments() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;

                if (!apiUrl) {
                    throw new Error("API URL is not configured.");
                }

                const response = await fetch(`${apiUrl}/Appointments`);

                if (!response.ok) {
                    throw new Error(`Failed to load appointments: ${response.status}`);
                }

                const data: Appointment[] = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid appointment data received.");
                }

                setAppointments(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load appointments."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchAppointments();
    }, []);



    async function handleDelete(id: number) {
        if (!window.confirm("Are you sure you want to delete this appointment?")) {
            return;
        }

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;

            if (!apiUrl) {
                throw new Error("API URL is not configured.");
            }

            const response = await fetch(`${apiUrl}/Appointments/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error(`Delete failed: ${response.status}`);
            }

            setAppointments((current) =>
                current.filter((appointment) => appointment.id !== id)
            );
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to delete appointment."
            );
        }
    }


    return (
        <main className="min-h-screen p-6 md:p-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">
                            Appointments
                        </h1>
                        <p className="mt-2 text-slate-500">
                            Manage patient appointments.
                        </p>
                    </div>

                    <Link
                        href="/appointments/new"
                        className="rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                    >
                        + New Appointment
                    </Link>
                </div>

                <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm">
                    {loading ? (
                        <p className="p-8 text-slate-500">Loading appointments...</p>
                    ) : error ? (
                        <p role="alert" className="p-8 text-red-600">{error}</p>
                    ) : appointments.length === 0 ? (
                        <p className="p-8 text-slate-500">No appointments found.</p>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="p-4">ID</th>
                                    <th className="p-4">Patient</th>
                                    <th className="p-4">Doctor</th>
                                    <th className="p-4">Specialization</th>
                                    <th className="p-4">Date & Time</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {appointments.map((appointment) => (
                                    <tr key={appointment.id} className="hover:bg-slate-50">
                                        <td className="p-4">{appointment.id}</td>
                                        <td className="p-4 font-medium text-slate-800">
                                            {appointment.patientName}
                                        </td>
                                        <td className="p-4">{appointment.doctorName}</td>
                                        <td className="p-4">{appointment.specialization}</td>
                                        <td className="whitespace-nowrap p-4">
                                            {new Date(appointment.appointmentDate).toLocaleString(
                                                "en-GB",
                                                { dateStyle: "medium", timeStyle: "short" }
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {appointment.status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap p-4">
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={`/appointments/${appointment.id}/edit`}
                                                    className="font-medium text-blue-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(appointment.id)}
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
