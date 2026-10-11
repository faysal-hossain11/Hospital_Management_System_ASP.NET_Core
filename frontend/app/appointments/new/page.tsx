
"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Patient = {
  id: number;
  name: string;
};

type Doctor = {
  id: number;
  name: string;
  specialization: string;
};

export default function NewAppointmentPage() {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [optionsError, setOptionsError] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: "Scheduled",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOptions() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const [patientResponse, doctorResponse] = await Promise.all([
          fetch(`${apiUrl}/Patients`),
          fetch(`${apiUrl}/Doctors`),
        ]);

        if (!patientResponse.ok || !doctorResponse.ok) {
          throw new Error("Could not load patients or doctors.");
        }

        const [patientData, doctorData] = await Promise.all([
          patientResponse.json(),
          doctorResponse.json(),
        ]);

        if (!Array.isArray(patientData) || !Array.isArray(doctorData)) {
          throw new Error("Invalid patient or doctor data received.");
        }

        setPatients(patientData);
        setDoctors(doctorData);
      } catch (err) {
        setOptionsError(
          err instanceof Error ? err.message : "Failed to load form options."
        );
      } finally {
        setOptionsLoading(false);
      }
    }

    loadOptions();
  }, []);

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

      // datetime-local gives local time; convert it to UTC for the API.
      const selectedDate = new Date(form.appointmentDate);

      if (Number.isNaN(selectedDate.getTime())) {
        throw new Error("Please select a valid appointment date and time.");
      }

      if (selectedDate.getTime() <= Date.now()) {
        throw new Error("Appointment date must be in the future.");
      }

      const response = await fetch(`${apiUrl}/Appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: Number(form.patientId),
          doctorId: Number(form.doctorId),
          appointmentDate: selectedDate.toISOString(),
          status: form.status,
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
          `Failed to create appointment (${response.status}).`
        );
      }

      router.push("/appointments");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500";

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/appointments"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Appointments
        </Link>

        <h1 className="mt-6 text-3xl font-bold text-slate-800">
          New Appointment
        </h1>
        <p className="mt-2 text-slate-500">
          Select a patient, doctor, and appointment time.
        </p>

        {optionsLoading ? (
          <p className="mt-8 text-slate-500">
            Loading patients and doctors...
          </p>
        ) : optionsError ? (
          <p role="alert" className="mt-8 text-red-600">
            {optionsError}
          </p>
        ) : patients.length === 0 || doctors.length === 0 ? (
          <p className="mt-8 rounded-lg bg-amber-50 p-4 text-amber-800">
            Add at least one patient and one doctor before booking an
            appointment.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="patientId" className="font-medium text-slate-700">
                Patient
              </label>
              <select
                id="patientId"
                name="patientId"
                value={form.patientId}
                onChange={handleChange}
                className={fieldClass}
                required
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doctorId" className="font-medium text-slate-700">
                Doctor
              </label>
              <select
                id="doctorId"
                name="doctorId"
                value={form.doctorId}
                onChange={handleChange}
                className={fieldClass}
                required
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="appointmentDate"
                className="font-medium text-slate-700"
              >
                Appointment Date & Time
              </label>
              <input
                id="appointmentDate"
                name="appointmentDate"
                type="datetime-local"
                value={form.appointmentDate}
                onChange={handleChange}
                className={fieldClass}
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className={fieldClass}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
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
                {loading ? "Saving..." : "Create Appointment"}
              </button>

              <Link
                href="/appointments"
                className="rounded-lg border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
