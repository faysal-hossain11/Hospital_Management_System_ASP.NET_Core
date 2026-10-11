
"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Patient = {
  id: number;
  name: string;
};

type Doctor = {
  id: number;
  name: string;
  specialization: string;
};

type Appointment = {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  status: string;
};

function toLocalInputValue(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  );

  return localDate.toISOString().slice(0, 16);
}

export default function EditAppointmentPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    status: "Scheduled",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        if (!apiUrl) {
          throw new Error("API URL is not configured.");
        }

        const [appointmentResponse, patientResponse, doctorResponse] =
          await Promise.all([
            fetch(`${apiUrl}/Appointments/${id}`),
            fetch(`${apiUrl}/Patients`),
            fetch(`${apiUrl}/Doctors`),
          ]);

        if (
          !appointmentResponse.ok ||
          !patientResponse.ok ||
          !doctorResponse.ok
        ) {
          throw new Error("Failed to load appointment details.");
        }

        const [appointment, patientData, doctorData]: [
          Appointment,
          Patient[],
          Doctor[],
        ] = await Promise.all([
          appointmentResponse.json(),
          patientResponse.json(),
          doctorResponse.json(),
        ]);

        setPatients(patientData);
        setDoctors(doctorData);

        setForm({
          patientId: String(appointment.patientId),
          doctorId: String(appointment.doctorId),
          appointmentDate: toLocalInputValue(
            appointment.appointmentDate
          ),
          status: appointment.status,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load appointment."
        );
      } finally {
        setPageLoading(false);
      }
    }

    if (id) {
      loadData();
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

      const selectedDate = new Date(form.appointmentDate);

      if (
        !form.appointmentDate ||
        Number.isNaN(selectedDate.getTime())
      ) {
        throw new Error("Select a valid appointment date and time.");
      }

      if (selectedDate.getTime() <= Date.now()) {
        throw new Error("Appointment date must be in the future.");
      }

      const response = await fetch(`${apiUrl}/Appointments/${id}`, {
        method: "PUT",
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

        throw new Error(
          result?.message ??
          result?.title ??
          `Update failed: ${response.status}`
        );
      }

      router.push("/appointments");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update appointment."
      );
    } finally {
      setSaving(false);
    }
  }

  const fieldClass =
    "mt-1 w-full rounded-lg border border-slate-300 bg-white p-3 outline-none focus:border-blue-500";

  if (pageLoading) {
    return <main className="p-10">Loading appointment...</main>;
  }

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
          Edit Appointment
        </h1>

        {error && (
          <p role="alert" className="mt-4 text-red-600">
            {error}
          </p>
        )}

        {patients.length > 0 && doctors.length > 0 && (
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5 rounded-xl bg-white p-6 shadow-sm"
          >
            <div>
              <label htmlFor="patientId" className="font-medium">
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
                <option value="">Select patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} (ID: {patient.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="doctorId" className="font-medium">
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
                <option value="">Select doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="appointmentDate" className="font-medium">
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
              <label htmlFor="status" className="font-medium">
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

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Updating..." : "Update Appointment"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
