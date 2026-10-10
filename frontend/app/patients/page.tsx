
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  createdAt?: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPatients() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const response = await fetch(`${apiUrl}/Patients`);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data: Patient[] = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid patient data received.");
        }

        setPatients(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load patients."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPatients();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-10">
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
              Patients
            </h1>
            <p className="mt-2 text-slate-500">
              View all registered patients.
            </p>
          </div>

          <span className="rounded-lg bg-blue-100 px-4 py-2 font-semibold text-blue-700">
            Total: {patients.length}
          </span>
        </div>

        <div className="mt-8 overflow-x-auto rounded-xl bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-slate-500">Loading patients...</p>
          ) : error ? (
            <p className="p-8 text-red-600">{error}</p>
          ) : patients.length === 0 ? (
            <p className="p-8 text-slate-500">No patients found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-50">
                    <td className="p-4">{patient.id}</td>
                    <td className="p-4 font-medium text-slate-800">
                      {patient.name}
                    </td>
                    <td className="p-4">{patient.age}</td>
                    <td className="p-4">{patient.gender}</td>
                    <td className="p-4">{patient.phone}</td>
                    <td className="p-4">{patient.address}</td>
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
