"use client"

import type {
  ChangeEvent,
  DragEvent,
  FormEvent,
} from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  ImageIcon,
  Link as LinkIcon,
  Loader2,
  MapPin,
  Upload,
  X,
} from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createTuition, getTutorTuitions } from "@/lib/actions/tuitions"
import { uploadImage } from "@/lib/actions/uploadImage"
import { getPremiumById } from "@/lib/actions/premium"
import { useSession } from "@/lib/auth-client"
import {
  classLevels,
  tuitionSubjectsByClassLevel,
  type ClassLevel,
} from "@/lib/data/tuition-options"
import type {
  TuitionClassTime,
  TuitionFormData,
  TuitionMode,
} from "@/lib/types/tuition"

const acceptedImageTypes = ["image/jpeg", "image/png", "image/webp"]
const maximumFileSize = 5 * 1024 * 1024
const classTimeOptions: TuitionClassTime[] = [
  "Morning (8:00 AM - 12:00 PM)",
  "Afternoon (12:00 PM - 4:00 PM)",
  "Evening (4:00 PM - 8:00 PM)",
  "Flexible / Discuss with Tutor",
]

export default function PostTuitionPage() {
  const router = useRouter()
  const { data: session, isPending: isSessionPending } = useSession()
  const [imageMethod, setImageMethod] = useState<"upload" | "url">("upload")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [hasImageError, setHasImageError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [classLevel, setClassLevel] = useState<ClassLevel | "">("")
  const [subject, setSubject] = useState("")

  const previewImage = imageMethod === "upload" ? filePreview : imageUrl.trim()

  function selectImage(file: File | undefined) {
    if (!file) return

    if (!acceptedImageTypes.includes(file.type)) {
      toast.error("Please choose a JPG, PNG, or WebP image.")
      return
    }

    if (file.size > maximumFileSize) {
      toast.error("Image size must be 5 MB or less.")
      return
    }

    setImageFile(file)
    setFilePreview(URL.createObjectURL(file))
    setHasImageError(false)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectImage(event.target.files?.[0])
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    if (isSubmitting) return
    selectImage(event.dataTransfer.files?.[0])
  }

  function removeImage() {
    setImageFile(null)
    setFilePreview("")
    setImageUrl("")
    setHasImageError(false)
  }

  function isValidImageUrl(url: string) {
    try {
      const parsedUrl = new URL(url)
      return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"
    } catch {
      return false
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!session?.user) {
      toast.error("Please sign in before submitting a tuition.")
      return
    }

    const formData = new FormData(event.currentTarget)
    const monthlyFee = Number(formData.get("monthlyFee"))
    const daysPerWeek = Number(formData.get("daysPerWeek"))
    const classTimes = formData
      .getAll("classTimes")
      .map(String)
      .filter((time): time is TuitionClassTime =>
        classTimeOptions.includes(time as TuitionClassTime)
      )

    if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
      toast.error("Enter a valid monthly fee.")
      return
    }

    if (!Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
      toast.error("Days per week must be between 1 and 7.")
      return
    }

    if (classTimes.length === 0) {
      toast.error("Please select at least one class time.")
      return
    }

    let bannerImage = ""

    if (imageMethod === "upload") {
      if (!imageFile) {
        toast.error("Please upload a banner image.")
        return
      }
    } else {
      bannerImage = imageUrl.trim()
      if (!isValidImageUrl(bannerImage)) {
        toast.error("Please enter a valid image URL.")
        return
      }
    }

    setIsSubmitting(true)

    try {
      const tuitions = await getTutorTuitions(session.user.id)
      if (!Array.isArray(tuitions)) {
        throw new Error("Could not check your tuition count.")
      }
      if (tuitions.length >= 2 && !(await getPremiumById(session.user.id))) {
        toast.info("You have reached the free limit of 2 tuition posts. Upgrade to post more.")
        router.push("/pricing")
        return
      }

      if (imageMethod === "upload" && imageFile) {
        bannerImage = await uploadImage(imageFile)
      }

      const tuition: TuitionFormData = {
        title: String(formData.get("title") || "").trim(),
        subject: String(formData.get("subject") || "").trim(),
        classLevel: String(formData.get("classLevel") || "").trim(),
        mode: String(formData.get("mode")) as TuitionMode,
        location: String(formData.get("location") || "").trim(),
        monthlyFee,
        daysPerWeek,
        classTimes,
        description: String(formData.get("description") || "").trim(),
        bannerImage,
        isActive: true,
      }

      await createTuition(tuition)
      toast.success("Tuition submitted for approval.")
      router.push("/dashboard/tutor/my-tuitions")
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not submit the tuition. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-8">
        <p className="text-xs font-semibold tracking-[0.18em] text-blue-600 uppercase">
          Tutor workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-blue-950">
          Post a New Tuition
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          Share your tuition details with students. Every new listing is sent
          for admin approval before it becomes visible.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="dashboard-surface rounded-2xl border p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            <h2 className="font-semibold text-blue-950">Tuition information</h2>
          </div>

          <div className="space-y-5">
            <div>
              <Label htmlFor="title" className="mb-2 text-slate-700">
                Tuition title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                maxLength={150}
                placeholder="e.g. HSC Higher Math Full Course"
                className="h-11 border-blue-100 bg-slate-50 px-3 focus-visible:border-blue-500"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="classLevel" className="mb-2 text-slate-700">
                  Class level <span className="text-red-500">*</span>
                </Label>
                <select
                  id="classLevel"
                  name="classLevel"
                  required
                  value={classLevel}
                  onChange={(event) => {
                    setClassLevel(event.target.value as ClassLevel | "")
                    setSubject("")
                  }}
                  className="h-11 w-full rounded-lg border border-blue-100 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
                >
                  <option value="">Select class level</option>
                  {classLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="subject" className="mb-2 text-slate-700">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <select
                  id="subject"
                  name="subject"
                  required
                  disabled={!classLevel}
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="h-11 w-full rounded-lg border border-blue-100 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                >
                  <option value="">
                    {classLevel
                      ? "Select a subject"
                      : "Select a class level first"}
                  </option>
                  {classLevel &&
                    tuitionSubjectsByClassLevel[classLevel].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="mode" className="mb-2 text-slate-700">
                  Tuition mode <span className="text-red-500">*</span>
                </Label>
                <select
                  id="mode"
                  name="mode"
                  required
                  defaultValue="Online"
                  className="h-11 w-full rounded-lg border border-blue-100 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
                >
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location" className="mb-2 text-slate-700">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <MapPin
                    aria-hidden="true"
                    className="pointer-events-none absolute top-3.5 left-3 size-4 text-slate-400"
                  />
                  <Input
                    id="location"
                    name="location"
                    required
                    maxLength={120}
                    placeholder="Online or Dhanmondi, Dhaka"
                    className="h-11 border-blue-100 bg-slate-50 pr-3 pl-10 focus-visible:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="monthlyFee" className="mb-2 text-slate-700">
                  Monthly fee (৳) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="monthlyFee"
                  name="monthlyFee"
                  type="number"
                  required
                  min="1"
                  step="1"
                  placeholder="e.g. 2500"
                  className="h-11 border-blue-100 bg-slate-50 px-3 focus-visible:border-blue-500"
                />
              </div>
              <div>
                <Label htmlFor="daysPerWeek" className="mb-2 text-slate-700">
                  Days per week <span className="text-red-500">*</span>
                </Label>
                <select
                  id="daysPerWeek"
                  name="daysPerWeek"
                  required
                  defaultValue=""
                  className="h-11 w-full rounded-lg border border-blue-100 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20"
                >
                  <option value="" disabled>
                    Select days per week
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                    <option key={days} value={days}>
                      {days} {days === 1 ? "day" : "days"} per week
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-700">
                Available class times <span className="text-red-500">*</span>
              </legend>
              <p className="mb-3 text-xs text-slate-500">
                Select every batch time you can offer. Students can choose one
                when applying.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {classTimeOptions.map((time) => (
                  <Label
                    key={time}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-blue-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    <input
                      type="checkbox"
                      name="classTimes"
                      value={time}
                      className="size-4 rounded border-blue-300 text-blue-600 accent-blue-600"
                    />
                    {time}
                  </Label>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor="description" className="mb-2 text-slate-700">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                minLength={20}
                maxLength={1500}
                placeholder="Describe what students will learn, the teaching style, and any important requirements."
                className="min-h-32 border-blue-100 bg-slate-50 px-3 py-3 focus-visible:border-blue-500"
              />
            </div>
          </div>
        </section>

        <section className="dashboard-surface rounded-2xl border p-5 sm:p-7">
          <div className="mb-5 flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              2
            </span>
            <div>
              <h2 className="font-semibold text-blue-950">Tuition banner image</h2>
              <p className="mt-1 text-xs text-slate-500">
                Use either image upload or an image URL.
              </p>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => setImageMethod("upload")}
              className={
                imageMethod === "upload"
                  ? "h-10 bg-blue-600 text-white hover:bg-blue-700"
                  : "h-10 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }
            >
              <Upload aria-hidden="true" />
              Upload image
            </Button>
            <Button
              type="button"
              onClick={() => setImageMethod("url")}
              className={
                imageMethod === "url"
                  ? "h-10 bg-blue-600 text-white hover:bg-blue-700"
                  : "h-10 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }
            >
              <LinkIcon aria-hidden="true" />
              Paste image URL
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(230px,0.8fr)]">
            <div>
              {imageMethod === "upload" ? (
                <Label
                  htmlFor="bannerImage"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={handleDrop}
                  className="flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-6 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
                >
                  <Upload aria-hidden="true" className="mb-3 size-8 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-950">
                    Drag and drop your banner here
                  </span>
                  <span className="mt-1 text-sm text-slate-600">
                    or browse files from your computer
                  </span>
                  <span className="mt-4 text-xs text-slate-500">
                    JPG, PNG, or WebP · Maximum 5 MB
                  </span>
                  <input
                    id="bannerImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </Label>
              ) : (
                <div className="min-h-64 rounded-2xl bg-blue-50 p-5 sm:p-6">
                  <Label htmlFor="bannerImageUrl" className="mb-3 text-slate-700">
                    Paste your tuition banner image URL
                  </Label>
                  <Input
                    id="bannerImageUrl"
                    type="url"
                    value={imageUrl}
                    onChange={(event) => {
                      setImageUrl(event.target.value)
                      setHasImageError(false)
                    }}
                    placeholder="https://example.com/tuition-banner.jpg"
                    className="h-11 border-blue-100 bg-white px-3 focus-visible:border-blue-500"
                  />
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Paste a direct public image link. The image will appear in
                    the preview panel.
                  </p>
                </div>
              )}
            </div>

            <aside className="rounded-2xl border border-blue-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
                Banner preview
              </p>
              <div className="mt-3 aspect-[16/10] overflow-hidden rounded-xl border border-blue-100 bg-blue-50">
                {previewImage && !hasImageError ? (
                  <>
                    {/* The preview can be an arbitrary tutor-supplied URL, so next/image cannot use a fixed remote pattern. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt="Selected tuition banner preview"
                      onError={() => setHasImageError(true)}
                      className="h-full w-full object-cover"
                    />
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                    <ImageIcon aria-hidden="true" className="size-8 text-blue-300" />
                    <p className="mt-2 text-xs text-slate-500">
                      Your selected banner will appear here.
                    </p>
                  </div>
                )}
              </div>
              {previewImage && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="mt-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <X aria-hidden="true" />
                  Remove image
                </Button>
              )}
            </aside>
          </div>
        </section>

        <div className="dashboard-surface flex flex-col-reverse items-start justify-between gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center">
          <p className="flex items-start gap-2 text-xs leading-5 text-slate-600">
            <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-blue-600" />
            Your tuition will be saved as pending and reviewed by an admin.
          </p>
          <Button
            type="submit"
            disabled={isSubmitting || isSessionPending || !session?.user}
            className="h-11 bg-blue-600 px-5 text-white hover:bg-blue-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit for Approval"
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
