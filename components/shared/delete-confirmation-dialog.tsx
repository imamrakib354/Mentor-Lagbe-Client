"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BookmarkX, Trash2 } from "lucide-react"
import { toast } from "react-toastify"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cancelApplication } from "@/lib/actions/application"
import { removeSavedTuition } from "@/lib/actions/saved-tuitions"
import { deleteTuition } from "@/lib/actions/tuitions"

type DeleteKind = "saved" | "application" | "tuition"

const messages = {
  saved: {
    title: "Remove saved tuition?",
    description: "Only this bookmark will be removed.",
    button: "Remove",
    success: "Saved tuition removed.",
  },
  application: {
    title: "Cancel application?",
    description: "Your pending application will be deleted.",
    button: "Cancel application",
    success: "Application cancelled.",
  },
  tuition: {
    title: "Delete tuition?",
    description: "This tuition listing will be permanently deleted.",
    button: "Delete tuition",
    success: "Tuition deleted.",
  },
} as const

export function DeleteConfirmationDialog({
  kind,
  id,
  name,
  onDeleted,
}: {
  kind: DeleteKind
  id: string
  name: string
  onDeleted?: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const message = messages[kind]

  async function handleDelete() {
    if (isDeleting) return
    setIsDeleting(true)
    try {
      if (kind === "saved") await removeSavedTuition(id)
      if (kind === "application") await cancelApplication(id)
      if (kind === "tuition") await deleteTuition(id)
      toast.success(message.success)
      setOpen(false)
      onDeleted?.(id)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not complete the request.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => {
      if (!isDeleting) setOpen(nextOpen)
    }}>
      <AlertDialogTrigger
        aria-label={`${message.button} ${name}`}
        render={<Button type="button" size={kind === "tuition" ? "sm" : "default"} variant={kind === "tuition" ? "destructive" : "outline"} className={kind === "tuition" ? "" : "border-blue-100 text-blue-700"} />}
      >
        {kind === "saved" && <BookmarkX aria-hidden="true" />}
        {kind === "tuition" && <Trash2 aria-hidden="true" />}
        {kind === "application" ? "Cancel" : kind === "tuition" ? "Delete" : "Remove"}
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-blue-950">{message.title}</AlertDialogTitle>
          <AlertDialogDescription>{message.description} ({name})</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Keep</AlertDialogCancel>
          <Button type="button" onClick={handleDelete} disabled={isDeleting} className="bg-red-600 text-white hover:bg-red-700">
            {isDeleting ? "Please wait..." : message.button}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
