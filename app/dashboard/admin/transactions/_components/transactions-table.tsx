"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Payment } from "@/lib/types/payment"

const filters = ["all", "paid", "pending", "failed"] as const

export function TransactionsTable({ payments }: { payments: Payment[] }) {
  const [filter, setFilter] = useState<(typeof filters)[number]>("all")
  const transactions = payments.filter((payment) => filter === "all" || payment.status?.toLowerCase() === filter)

  return (
    <div className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm shadow-blue-950/5">
      <header className="bg-gradient-to-r from-blue-50 to-blue-100 px-5 py-7 sm:px-8">
        <p className="text-xs font-bold tracking-[0.18em] text-blue-600 uppercase">Payments</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">Transactions</h1>
        <p className="mt-2 text-sm text-slate-600">View payment history and transaction statuses.</p>
      </header>
      <section className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <Button
              key={item}
              type="button"
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              className={filter === item ? "h-10 rounded-full bg-blue-600 px-4 text-white hover:bg-blue-700" : "h-10 rounded-full bg-blue-50 px-4 text-blue-700 hover:bg-blue-100"}
            >
              {item === "all" ? "All Transactions" : item.charAt(0).toUpperCase() + item.slice(1)}
            </Button>
          ))}
        </div>
        {transactions.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            {payments.length === 0 ? "No transactions found." : `No ${filter} transactions found.`}
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-blue-100">
            <Table>
              <TableHeader className="bg-blue-50">
                <TableRow className="border-blue-100">
                  {["User", "Role", "Plan Purchased", "Amount", "Transaction ID", "Status", "Paid Date"].map((heading) => (
                    <TableHead key={heading} className="px-4 py-4 text-xs font-bold tracking-wide text-blue-900 uppercase">{heading}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((payment) => {
                  const status = payment.status?.toLowerCase() || "unknown"
                  const statusClass = status === "paid" ? "bg-emerald-50 text-emerald-700" : status === "pending" ? "bg-amber-50 text-amber-700" : status === "failed" ? "bg-rose-50 text-rose-700" : "bg-slate-100 text-slate-600"
                  const date = payment.paidDate ? new Date(payment.paidDate) : null
                  return (
                    <TableRow key={payment._id} className="border-blue-100">
                      <TableCell className="px-4 py-5">
                        <p className="font-semibold text-blue-950">{payment.userName || "Unknown user"}</p>
                        <p className="mt-1 text-slate-500">{payment.userEmail || "—"}</p>
                      </TableCell>
                      <TableCell className="px-4"><span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 capitalize">{payment.role || "Unknown"}</span></TableCell>
                      <TableCell className="px-4 font-semibold text-amber-700">{payment.plan || "—"}</TableCell>
                      <TableCell className="px-4 font-semibold text-blue-950">{payment.amount == null ? "—" : `${(payment.currency || "usd").toUpperCase()} ${(payment.amount / 100).toFixed(2)}`}</TableCell>
                      <TableCell className="px-4"><span className="rounded-full border border-blue-100 bg-blue-50/50 px-3 py-1.5 text-xs text-blue-900">{payment.transactionId || "—"}</span></TableCell>
                      <TableCell className="px-4"><span className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusClass}`}>{status}</span></TableCell>
                      <TableCell className="px-4 text-slate-600">{date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }) : "—"}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  )
}
