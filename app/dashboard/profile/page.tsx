import { redirect } from "next/navigation"
import { BookText, GraduationCap, LockKeyhole, Mail, Phone, UserRound } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser } from "@/lib/helpers/getCurrentUser"
import { EditProfileDialog } from "./_components/edit-profile-dialog"

export default async function UserProfilePage() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")

  const fields = [
    { label: "Full Name", value: user.name, icon: UserRound },
    { label: "Email Address", value: user.email, icon: Mail, readOnly: true },
    { label: "Role", value: user.role || "student", icon: GraduationCap, readOnly: true },
    { label: "Phone Number", value: user.phone || "Not added yet", icon: Phone },
    { label: "Bio", value: user.bio || "Not added yet", icon: BookText },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-7">
        <p className="text-xs font-bold tracking-[0.2em] text-blue-600 uppercase">Your account</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-blue-950 sm:text-4xl">My Profile</h1>
        <p className="mt-2 text-sm text-slate-600">View your personal information and account details.</p>
      </header>

      <section className="dashboard-surface rounded-3xl border p-5 sm:p-8">
        <div className="flex flex-col items-start gap-5 border-b border-blue-200/60 pb-7 sm:flex-row sm:items-center">
          <Avatar className="size-28 border-4 border-white/80 shadow-lg shadow-blue-900/10 sm:size-36">
            {user.image && <AvatarImage src={user.image} alt="" />}
            <AvatarFallback className="bg-blue-200 text-3xl font-bold text-blue-700">{user.name.trim().charAt(0).toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h2 className="break-words text-2xl font-bold text-blue-950 sm:text-3xl">{user.name}</h2>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-200/70 px-3 py-1 text-xs font-bold text-blue-700 capitalize">
              <GraduationCap aria-hidden="true" className="size-4" />{user.role || "student"}
            </span>
            <p className="mt-3 flex min-w-0 items-center gap-2 text-sm text-slate-600"><Mail aria-hidden="true" className="size-4 shrink-0 text-blue-600" /><span className="break-all">{user.email}</span></p>
          </div>
          <EditProfileDialog name={user.name} phone={user.phone} bio={user.bio} image={user.image} />
        </div>

        <dl className="divide-y divide-blue-200/50 pt-2">
          {fields.map(({ label, value, icon: Icon, readOnly }) => (
            <div key={label} className="grid gap-2 py-4 sm:grid-cols-[190px_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
              <dt className="flex items-center gap-3 text-sm font-semibold text-blue-950">
                <span className="flex size-9 items-center justify-center rounded-xl bg-blue-100/80 text-blue-600"><Icon aria-hidden="true" className="size-4" /></span>{label}
              </dt>
              <dd className={`break-words pl-12 text-sm sm:pl-0 ${value === "Not added yet" ? "text-slate-500" : "text-blue-950"} ${label === "Role" ? "capitalize" : ""}`}>{value}</dd>
              {readOnly && <span className="ml-12 inline-flex w-fit items-center gap-1 rounded-full bg-blue-100/80 px-2.5 py-1 text-xs text-blue-700 sm:ml-0"><LockKeyhole aria-hidden="true" className="size-3" />Read only</span>}
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
