import { getPayments } from "@/lib/actions/payments"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { TransactionsTable } from "./_components/transactions-table"

export default async function TransactionsPage() {
  const user = await getCurrentUser()
  if (user?.role !== "admin") {
    return <p className="rounded-2xl bg-white p-6 text-slate-600">Sign in as an admin to view transactions.</p>
  }

  const payments = await getPayments().catch(() => null)
  if (!payments) {
    return <p className="rounded-2xl bg-white p-6 text-red-600">Could not load transactions. Please try again.</p>
  }

  return <TransactionsTable payments={payments} />
}
