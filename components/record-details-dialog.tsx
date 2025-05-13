"use client"

import { ReactNode } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface RecordDetailsDialogProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  actions?: ReactNode
  className?: string
}

export default function RecordDetailsDialog({
  title,
  isOpen,
  onClose,
  children,
  actions,
  className
}: Readonly<RecordDetailsDialogProps>) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[600px] bg-white ${className ?? ''}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {actions}
          </div>
          <Button type="button" variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
