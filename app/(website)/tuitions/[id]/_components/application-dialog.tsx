"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { PhoneInput } from "@/components/shared/phone-input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createApplication, getStudentApplications } from "@/lib/actions/application"
import { getPremiumById } from "@/lib/actions/premium"
import { isValidPhone } from "@/lib/helpers/phone"
import type { Tuition } from "@/lib/types/tuition"

type ApplicationDialogProps = {
  tuition: Tuition
  student: { id: string; name: string; email: string }
  tutorName: string
  tutorEmail: string
}

export function ApplicationDialog({
  tuition,
  student,
  tutorName,
  tutorEmail,
}: ApplicationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const classTimes = tuition.classTimes ?? []

  async function handleApply() {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const listing = await getStudentApplications(student.id)
      if (typeof listing.counts?.all !== "number") {
        throw new Error("Could not check your application count.")
      }
      if (listing.counts.all >= 5 && !(await getPremiumById(student.id))) {
        toast.info("You have reached the free limit of 5 applications. Upgrade to apply for more.")
        router.push("/pricing")
        return
      }
      setOpen(true)
    } catch {
      toast.error("Could not check your application limit. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const form = new FormData(event.currentTarget)
    const phone = String(form.get("phone") || "").trim()
    const preferredSchedule = String(form.get("preferredSchedule") || "")
    if (!isValidPhone(phone)) {
      toast.error("Enter a valid phone number using 01, 880, or +880.")
      return
    }
    if (!classTimes.includes(preferredSchedule as (typeof classTimes)[number])) {
      toast.error("Please select an available schedule.")
      return
    }

    setIsSubmitting(true)
    try {
      await createApplication({
        tuitionId: tuition._id,
        applicantId: student.id,
        applicantName: student.name,
        applicantEmail: student.email,
        tutorId: tuition.tutorId,
        tutorName,
        tutorEmail,
        tuitionTitle: tuition.title,
        bannerImage: tuition.bannerImage,
        subject: tuition.subject,
        classLevel: tuition.classLevel,
        monthlyFee: tuition.monthlyFee,
        phone,
        preferredSchedule,
        learningNote: String(form.get("learningNote") || "").trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
      })
      toast.success("Application submitted successfully!")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your application.")
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button type="button" onClick={handleApply} disabled={isSubmitting} className="h-12 w-full bg-blue-600 text-base font-semibold text-white hover:bg-blue-700">
        <Send aria-hidden="true" /> Apply Now
      </Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-blue-950">
            Apply for Tuition
          </DialogTitle>
          <DialogDescription className="text-slate-600">
            Send your application details to {tutorName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="application-tuition">Tuition</Label>
            <Input id="application-tuition" value={tuition.title} readOnly className="h-11 border-blue-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-phone">Contact phone number *</Label>
            <PhoneInput id="application-phone" required className="h-11 border-blue-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-schedule">Preferred schedule *</Label>
            <select id="application-schedule" name="preferredSchedule" required defaultValue="" className="h-11 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm text-blue-950">
              <option value="" disabled>Select a batch time</option>
              {classTimes.map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
            {classTimes.length === 0 && (
              <p className="text-xs text-slate-500">No batch times are available for this tuition yet.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="application-note">Notes for the mentor (optional)</Label>
            <Textarea id="application-note" name="learningNote" maxLength={1500} placeholder="Share what you would like to learn..." className="min-h-24 border-blue-100" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => setOpen(false)} className="h-10 border-blue-100">Cancel</Button>
            <Button type="submit" disabled={isSubmitting || classTimes.length === 0} className="h-10 bg-blue-600 text-white hover:bg-blue-700">
              {isSubmitting ? "Submitting..." : "Confirm Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}
