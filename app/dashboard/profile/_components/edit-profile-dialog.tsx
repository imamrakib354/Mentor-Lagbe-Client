"use client"

import { useEffect, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Pencil, Upload } from "lucide-react"
import { toast } from "react-toastify"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PhoneInput } from "@/components/shared/phone-input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { uploadImage } from "@/lib/actions/uploadImage"
import { updateUserProfile } from "@/lib/actions/users"
import { isValidPhone } from "@/lib/helpers/phone"

export function EditProfileDialog({ name, phone, bio, image }: { name: string; phone?: string | null; bio?: string | null; image?: string | null }) {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState(image || "")
  const [filePreview, setFilePreview] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageError, setImageError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  function selectFile(file?: File) {
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setImageError("Choose a JPG, PNG, or WebP image up to 5 MB.")
      return
    }
    setImageError("")
    setImageFile(file)
    setFilePreview(URL.createObjectURL(file))
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    selectFile(event.dataTransfer.files[0])
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    selectFile(event.target.files?.[0])
    event.target.value = ""
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isSubmitting) return
    setOpen(nextOpen)
    if (!nextOpen) {
      setFilePreview("")
      setImageFile(null)
      setImageUrl(image || "")
      setImageError("")
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return

    const form = new FormData(event.currentTarget)
    const updatedName = String(form.get("name") || "").trim()
    const updatedPhone = String(form.get("phone") || "").trim()
    if (!updatedName) {
      toast.error("Please enter your name.")
      return
    }
    if (updatedPhone && !isValidPhone(updatedPhone)) {
      toast.error("Enter a valid phone number using 01, 880, or +880.")
      return
    }

    setIsSubmitting(true)
    try {
      let updatedImage = imageUrl.trim() || null
      if (imageFile) {
        updatedImage = await uploadImage(imageFile)
      } else if (updatedImage && updatedImage !== (image || "")) {
        updatedImage = await uploadImage(updatedImage)
      }

      await updateUserProfile({
        name: updatedName,
        phone: updatedPhone,
        bio: String(form.get("bio") || "").trim(),
        image: updatedImage,
      })
      toast.success("Profile updated successfully.")
      setOpen(false)
      setImageUrl(updatedImage || "")
      setFilePreview("")
      setImageFile(null)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update your profile.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const preview = filePreview || imageUrl.trim()

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button className="h-11 rounded-xl bg-blue-600 px-5 font-semibold text-white hover:bg-blue-700" />}>
        <Pencil aria-hidden="true" className="size-4" /> Edit Profile
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl border border-blue-200 bg-[#edf3ff] p-6 sm:max-w-3xl sm:p-8">
        <DialogHeader className="pr-8">
          <DialogTitle className="text-2xl font-bold text-blue-950">Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information and profile picture.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
        <div className="mt-2 grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:gap-8">
          <div className="flex flex-col items-center justify-start gap-3 rounded-2xl bg-blue-100/50 p-5 text-center sm:bg-transparent sm:px-0">
            <Avatar className="size-32 border-4 border-white/80 shadow-md shadow-blue-900/10">
              {preview && <AvatarImage key={preview} src={preview} alt="" />}
              <AvatarFallback className="bg-blue-200 text-3xl font-bold text-blue-700">{name.trim().charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <p className="text-xs leading-5 text-slate-500">Your profile picture preview</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2"><Label htmlFor="profile-name">Name</Label><Input id="profile-name" name="name" required defaultValue={name} className="h-11 border-blue-200 bg-white/80" /></div>
            <div className="space-y-2"><Label htmlFor="profile-phone">Phone (optional)</Label><PhoneInput id="profile-phone" defaultValue={phone || ""} className="h-11 border-blue-200 bg-white/80" /></div>
            <div className="space-y-2"><Label htmlFor="profile-bio">Bio</Label><Textarea id="profile-bio" name="bio" defaultValue={bio || ""} placeholder="Tell us a little about yourself" className="min-h-24 border-blue-200 bg-white/80" /></div>
            <div className="space-y-2">
              <Label htmlFor="profile-image-url">Profile Picture URL</Label>
              <Input id="profile-image-url" type="url" value={imageUrl} onChange={(event) => { setImageUrl(event.target.value); setFilePreview(""); setImageFile(null); setImageError("") }} placeholder="https://example.com/photo.jpg" className="h-11 border-blue-200 bg-white/80" />
              <p className="text-xs text-slate-500">Paste a public image URL or choose a file below.</p>
            </div>
            <div className="space-y-2">
              <div onDragEnter={(event) => event.preventDefault()} onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} className="rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/70 hover:bg-blue-100/70">
                <Label htmlFor="profile-image-file" className="flex cursor-pointer flex-col items-center gap-2 p-4 text-center text-blue-700">
                  <span className="flex items-center gap-2 text-sm font-semibold"><Upload aria-hidden="true" className="size-4" /> Choose or drop an image</span>
                  <span className="text-xs font-normal text-slate-500">JPG, PNG or WebP · maximum 5 MB</span>
                </Label>
                <input id="profile-image-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" />
              </div>
              {filePreview && <p className="flex items-center gap-1 text-xs text-blue-700"><ImagePlus aria-hidden="true" className="size-3.5" /> Local image selected for preview.</p>}
              {imageError && <p role="alert" className="text-xs text-red-700">{imageError}</p>}
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4 rounded-b-3xl border-blue-200/60 bg-blue-100/40">
          <DialogClose render={<Button type="button" variant="outline" disabled={isSubmitting} className="rounded-xl border-blue-200 bg-white/70 text-blue-950" />}>Cancel</DialogClose>
          <Button type="submit" disabled={isSubmitting} className="rounded-xl bg-blue-600 text-white disabled:opacity-60">{isSubmitting ? "Saving..." : "Update Profile"}</Button>
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
