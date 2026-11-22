"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Bookmark } from "lucide-react"
import { toast } from "react-toastify"

import { Button } from "@/components/ui/button"
import { removeSavedTuition, saveTuition } from "@/lib/actions/saved-tuitions"

export function SaveTuitionButton({
  studentId,
  tuitionId,
  bookmarkId,
}: {
  studentId: string
  tuitionId: string
  bookmarkId: string | null | undefined
}) {
  const [isSaving, setIsSaving] = useState(false)
  const [isRefreshing, startTransition] = useTransition()
  const router = useRouter()
  const isSaved = Boolean(bookmarkId)

  async function handleToggle() {
    if (isSaving || isRefreshing || bookmarkId === undefined) return
    setIsSaving(true)
    try {
      if (bookmarkId) {
        await removeSavedTuition(bookmarkId)
        toast.success("Tuition removed from saved.")
      } else {
        const result = await saveTuition(studentId, tuitionId)
        toast.success(result.alreadySaved ? "Tuition already saved." : "Tuition saved successfully.")
      }
      startTransition(() => router.refresh())
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update saved tuition.")
    } finally {
      setIsSaving(false)
    }
  }

  const label = bookmarkId === undefined ? "Could not check saved status" : isSaved ? "Remove from saved" : "Save tuition"

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={isSaving || isRefreshing || bookmarkId === undefined}
      onClick={handleToggle}
      aria-label={label}
      aria-pressed={isSaved}
      title={label}
      className="size-11 shrink-0 border-blue-200 bg-white text-blue-700"
    >
      <Bookmark aria-hidden="true" fill={isSaved ? "currentColor" : "none"} />
    </Button>
  )
}
