"use client";

import Link from "next/link";
import { useEffect, useState } from "react";



export default function Home() {

  const [patientCount, setPatientCount] = useState(0);
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);



  const stats = [
    {
      title: "Total Patients",
      value: String(patientCount),
      icon: "👥",
    },
    {
      title: "Total Doctors",
      value: String(doctorCount),
      icon: "🩺",
    },
    {
      title: "Appointments",
      value: String(appointmentCount),
      icon: "📅",
    },
  ];

  useEffect(() => {
    async function fetchCount(
      endpoint: string,
      setCount: (count: number) => void
    ) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`
        );

        if (!response.ok) {
          throw new Error(`${endpoint} API failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(`${endpoint} API did not return an array`);
        }

        setCount(data.length);
      } catch (error) {
        console.error(`${endpoint} API error:`, error);
      }
    }

    fetchCount("Patients", setPatientCount);
    fetchCount("Doctors", setDoctorCount);
    fetchCount("Appointments", setAppointmentCount);
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h2>
          <p className="mt-2 text-slate-500">
            Welcome to Hospital Management System
          </p>
        </header>

        {/* Statistics */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>
                <span className="text-2xl">{stat.icon}</span>
              </div>

              <p className="mt-4 text-3xl font-bold text-slate-800">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Welcome Card */}
        <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-800">
            Hospital Overview
          </h3>
          <p className="mt-2 text-slate-600">
            Manage patients, doctors, and appointments from one place.
          </p>
        </section>
      </main>
    </div>
  );
}
