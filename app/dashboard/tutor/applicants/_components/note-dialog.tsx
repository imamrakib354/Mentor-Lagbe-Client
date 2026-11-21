"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function NoteDialog({ name, note }: { name: string; note: string }) {
  return (
    <Dialog>
      <DialogTrigger
        aria-label={`View note from ${name}`}
        render={<Button type="button" variant="outline" className="border-blue-100 text-blue-700 hover:bg-blue-50" />}
      >
        View note
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto bg-white p-6 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-blue-950">Learning note</DialogTitle>
          <DialogDescription>Message from {name}</DialogDescription>
        </DialogHeader>
        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
          {note}
        </p>
      </DialogContent>
    </Dialog>
  )
}
