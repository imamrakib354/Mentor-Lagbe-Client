"use client"

import { useEffect, useRef, useState, type FormEvent } from "react"
import { ImageIcon, Pencil, X } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateTuitionDetails } from "@/lib/actions/tuitions"
import { uploadImage } from "@/lib/actions/uploadImage"
import type { Tuition, TuitionUpdateData } from "@/lib/types/tuition"

export function EditTuitionDialog({
  tuition,
  onUpdated,
}: {
  tuition: Tuition
  onUpdated: (details: TuitionUpdateData) => void
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState(tuition.bannerImage)
  const [filePreview, setFilePreview] = useState("")
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const preview = filePreview || imageUrl.trim()

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  function clearFile() {
    if (fileInputRef.current) fileInputRef.current.value = ""
    setFilePreview("")
    setImageError(false)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const form = new FormData(event.currentTarget)
    const location = String(form.get("location") || "").trim()
    const description = String(form.get("description") || "").trim()
    const monthlyFee = Number(form.get("monthlyFee"))
    const daysPerWeek = Number(form.get("daysPerWeek"))
    const mode = String(form.get("mode"))
    const image = form.get("image")
    let bannerImage = String(form.get("bannerImage") || "").trim()

    if (!location || description.length < 20 || !Number.isFinite(monthlyFee) || monthlyFee <= 0 ||
      !Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7 ||
      (mode !== "Online" && mode !== "Offline")) {
      toast.error("Please enter valid tuition details.")
      return
    }

    const file = image instanceof File && image.size > 0 ? image : null
    if (file && (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      toast.error("Choose a JPG, PNG, or WebP image of 5 MB or less.")
      return
    }

    if (!file) {
      try {
        const url = new URL(bannerImage)
        if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error()
      } catch {
        toast.error("Please enter a valid image URL.")
        return
      }
    }

    setIsSubmitting(true)
    try {
      if (file) bannerImage = await uploadImage(file)
      const details: TuitionUpdateData = {
        location,
        monthlyFee,
        daysPerWeek,
        mode,
        bannerImage,
        description,
      }
      await updateTuitionDetails(tuition._id, details)
      onUpdated(details)
      setOpen(false)
      clearFile()
      toast.success("Tuition updated successfully.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update tuition.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
      if (!isSubmitting) {
        setOpen(nextOpen)
        clearFile()
        if (nextOpen) {
          setImageUrl(tuition.bannerImage)
        }
      }
    }}>
      <DialogTrigger
        aria-label={`Edit ${tuition.title}`}
        render={<Button type="button" size="sm" variant="secondary" className="bg-blue-50 text-blue-700" />}
      >
        <Pencil aria-hidden="true" />
        <span className="hidden lg:inline">Edit</span>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white p-6 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-950">Edit Tuition</DialogTitle>
          <DialogDescription>Update the details of your tuition. Title, subject, and class level cannot be changed.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-950">
            <p className="font-semibold">{tuition.title}</p>
            <p className="mt-1 text-slate-600">{tuition.subject} · {tuition.classLevel}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-mode">Tuition mode</Label>
              <select id="edit-mode" name="mode" defaultValue={tuition.mode} required className="h-11 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm text-blue-950">
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input id="edit-location" name="location" defaultValue={tuition.location} required maxLength={120} className="h-11 border-blue-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fee">Monthly fee (৳)</Label>
              <Input id="edit-fee" name="monthlyFee" type="number" defaultValue={tuition.monthlyFee} required min="1" step="1" className="h-11 border-blue-100" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-days">Days per week</Label>
              <select id="edit-days" name="daysPerWeek" defaultValue={tuition.daysPerWeek} required className="h-11 w-full rounded-lg border border-blue-100 bg-white px-3 text-sm text-blue-950">
                {[1, 2, 3, 4, 5, 6, 7].map((days) => <option key={days} value={days}>{days} {days === 1 ? "day" : "days"} per week</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-banner">Banner image URL</Label>
            <Input id="edit-banner" name="bannerImage" type="url" value={imageUrl} onChange={(event) => {
              setImageUrl(event.target.value)
              setImageError(false)
            }} className="h-11 border-blue-100" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-image">Or upload a replacement image</Label>
            <Input id="edit-image" name="image" type="file" ref={fileInputRef} accept="image/jpeg,image/png,image/webp" onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) {
                clearFile()
                return
              }
              if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
                toast.error("Choose a JPG, PNG, or WebP image of 5 MB or less.")
                clearFile()
                return
              }
              setFilePreview(URL.createObjectURL(file))
              setImageError(false)
            }} className="h-11 border-blue-100 py-2" />
            <p className="text-xs text-slate-500">JPG, PNG, or WebP, up to 5 MB. A selected file replaces the URL.</p>
          </div>
          <div className="rounded-xl border border-blue-100 bg-slate-50 p-4">
            <p className="text-xs font-semibold tracking-wide text-blue-700 uppercase">Banner preview</p>
            <div className="mt-3 aspect-video overflow-hidden rounded-lg border border-blue-100 bg-blue-50">
              {preview && !imageError ? (
                // The preview can be a local file or a tutor-supplied image URL.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Tuition banner preview" onError={() => setImageError(true)} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-xs text-slate-500">
                  <ImageIcon aria-hidden="true" className="size-8 text-blue-300" />
                  {imageError ? "Could not preview this image." : "Your banner preview will appear here."}
                </div>
              )}
            </div>
            {filePreview && (
              <Button type="button" variant="ghost" size="sm" onClick={clearFile} className="mt-3 text-red-600 hover:bg-red-50">
                <X aria-hidden="true" /> Remove selected file
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea id="edit-description" name="description" defaultValue={tuition.description} required minLength={20} maxLength={1500} className="min-h-28 border-blue-100" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" disabled={isSubmitting} onClick={() => {
              setOpen(false)
              clearFile()
            }} className="border-blue-100">Cancel</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white hover:bg-blue-700">
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
