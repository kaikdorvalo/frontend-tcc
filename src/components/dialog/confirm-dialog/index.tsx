import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void; 
}

export function ConfirmDialog({ description, isOpen, onConfirm, setOpen,title }: ConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
                {description}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-alert">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm} data-testid="button-confirm-alert">Confirmar</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
  )
}