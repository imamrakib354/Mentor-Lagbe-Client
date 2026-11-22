import { ObjectId } from "mongodb"
import { redirect } from "next/navigation"

import { db } from "@/lib/auth"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"

async function chooseRole(formData: FormData) {
  "use server"

  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  const role = formData.get("role")
  if (role !== "student" && role !== "tutor") throw new Error("Please select a valid role.")
  if (!ObjectId.isValid(user.id) || user.banned) throw new Error("Could not update your role.")

  const result = await db.collection("user").updateOne(
    { _id: new ObjectId(user.id), role: "student", roleSelectionRequired: true },
    { $set: { role, roleSelectionRequired: false } }
  )
  if (result.matchedCount !== 1) throw new Error("Could not update your role. Please contact support.")
  redirect("/dashboard")
}

export default async function ChooseRolePage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  if (!user.roleSelectionRequired) {
    const { next } = await searchParams
    redirect(next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/dashboard")
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-blue-50 px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-950/5">
        <h1 className="text-2xl font-bold text-blue-950">How would you like to join?</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Choose your role to finish setting up your Google account.</p>
        <form action={chooseRole} className="mt-6 grid gap-3 sm:grid-cols-2">
          <button name="role" value="student" className="rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white hover:bg-blue-700">I&apos;m a student</button>
          <button name="role" value="tutor" className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-4 font-semibold text-blue-700 hover:bg-blue-100">I&apos;m a tutor</button>
        </form>
      </section>
    </main>
  )
}
