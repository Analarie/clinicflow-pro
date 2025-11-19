import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, FileText, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppointmentDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onEdit: () => void;
  onDelete: () => void;
}

export const AppointmentDetailsDialog = ({
  open,
  onOpenChange,
  appointment,
  onEdit,
  onDelete,
}: AppointmentDetailsDialogProps) => {
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Agendamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Paciente</p>
              <p className="font-semibold">{appointment.patientName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Psicólogo</p>
              <p className="font-semibold">{appointment.psychologistName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-semibold">
                {format(appointment.date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-semibold">{appointment.startTime} - {appointment.endTime}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Tipo e Status</p>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary capitalize">
                  {appointment.type}
                </span>
                <span className={cn(
                  "px-2 py-1 rounded text-xs font-medium",
                  appointment.status === 'confirmado' && "bg-success/10 text-success",
                  appointment.status === 'pendente' && "bg-warning/10 text-warning",
                  appointment.status === 'cancelado' && "bg-destructive/10 text-destructive",
                  appointment.status === 'concluido' && "bg-muted text-muted-foreground"
                )}>
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="text-sm mt-1">{appointment.notes}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Cancelar Agendamento
          </Button>
          <Button onClick={onEdit}>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
