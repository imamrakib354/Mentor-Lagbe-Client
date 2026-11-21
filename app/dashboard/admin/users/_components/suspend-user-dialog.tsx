"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { suspendUser } from "@/lib/actions/users"

export function SuspendUserDialog({
  userId,
  userName,
  disabled,
}: {
  userId: string
  userName: string
  disabled: boolean
}) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSuspend() {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await suspendUser(userId)
      toast.success("Account suspended successfully.")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not suspend this account.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(nextOpen) => {
      if (!isSubmitting) setOpen(nextOpen)
    }}>
      <AlertDialogTrigger render={<Button type="button" variant="outline" disabled={disabled} className="border-red-100 text-red-700 hover:bg-red-50" />}>
        Suspend
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold text-blue-950">Suspend {userName}?</AlertDialogTitle>
          <AlertDialogDescription>
            This user will be signed out and cannot sign in until their account is reactivated.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <Button type="button" disabled={isSubmitting} onClick={handleSuspend} className="bg-red-600 text-white hover:bg-red-700">
            {isSubmitting ? "Suspending..." : "Suspend account"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
