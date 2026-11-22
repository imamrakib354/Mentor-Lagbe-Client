"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function OverviewCharts({ data }: { data: { month: string; users: number | null; revenue: number | null }[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="dashboard-surface rounded-3xl border p-5 sm:p-6">
        <h2 className="text-xl font-bold text-blue-950">User growth</h2>
        <p className="mt-1 text-sm text-slate-500">Total users registered by the end of each month.</p>
        {data[0]?.users === null ? <p className="py-16 text-sm text-slate-500">User data is unavailable.</p> : <div className="mt-5 h-56"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data}><CartesianGrid stroke="#e5edff" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} /><YAxis allowDecimals={false} width={35} tickLine={false} axisLine={false} fontSize={12} /><Tooltip /><Area type="monotone" dataKey="users" stroke="#2563eb" fill="#bfdbfe" strokeWidth={3} isAnimationActive={false} /></AreaChart></ResponsiveContainer></div>}
      </section>
      <section className="dashboard-surface rounded-3xl border p-5 sm:p-6">
        <h2 className="text-xl font-bold text-blue-950">Revenue trend</h2>
        <p className="mt-1 text-sm text-slate-500">Recorded paid transactions in USD by month.</p>
        {data[0]?.revenue === null ? <p className="py-16 text-sm text-slate-500">Payment data is unavailable.</p> : <div className="mt-5 h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={data}><CartesianGrid stroke="#e5edff" vertical={false} /><XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} /><YAxis width={35} tickLine={false} axisLine={false} fontSize={12} /><Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} /><Bar dataKey="revenue" fill="#4f70f5" radius={[8, 8, 0, 0]} isAnimationActive={false} /></BarChart></ResponsiveContainer></div>}
      </section>
    </div>
  )
}
