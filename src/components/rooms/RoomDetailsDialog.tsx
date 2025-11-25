import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Room, RoomSchedule } from "@/types/room";
import { Calendar, Users, DoorOpen, Settings, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room;
  schedules: RoomSchedule[];
  onEdit: (room: Room) => void;
}

export function RoomDetailsDialog({
  open,
  onOpenChange,
  room,
  schedules,
  onEdit,
}: RoomDetailsDialogProps) {
  if (!room) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "bg-success text-success-foreground";
      case "ocupada":
        return "bg-destructive text-destructive-foreground";
      case "manutencao":
        return "bg-warning text-warning-foreground";
      case "limpeza":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      disponivel: "Disponível",
      ocupada: "Ocupada",
      manutencao: "Manutenção",
      limpeza: "Limpeza"
    };
    return labels[status] || status;
  };

  const getScheduleStatusColor = (status: string) => {
    switch (status) {
      case "agendado":
        return "bg-info text-info-foreground";
      case "em-andamento":
        return "bg-success text-success-foreground";
      case "concluido":
        return "bg-muted text-muted-foreground";
      case "cancelado":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const sortedSchedules = [...schedules].sort((a, b) => 
    a.startTime.getTime() - b.startTime.getTime()
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              {room.name}
            </DialogTitle>
            <Badge className={cn(getStatusColor(room.status))}>
              {getStatusLabel(room.status)}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase">
              Informações Básicas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Número</p>
                <p className="font-medium">{room.number}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Andar</p>
                <p className="font-medium">{room.floor}º</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  Capacidade
                </p>
                <p className="font-medium">{room.capacity} pessoa(s)</p>
              </div>
            </div>
          </div>

          {/* Equipamentos */}
          {room.equipment.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Equipamentos
              </h3>
              <div className="flex flex-wrap gap-2">
                {room.equipment.map((eq) => (
                  <Badge key={eq} variant="secondary">
                    {eq}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Observações */}
          {room.notes && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase">
                Observações
              </h3>
              <p className="text-sm">{room.notes}</p>
            </div>
          )}

          {/* Agendamentos de Hoje */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos de Hoje ({sortedSchedules.length})
            </h3>
            {sortedSchedules.length > 0 ? (
              <div className="space-y-2">
                {sortedSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-3 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {schedule.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {schedule.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <Badge className={cn("text-xs", getScheduleStatusColor(schedule.status))}>
                        {schedule.status === "agendado" && "Agendado"}
                        {schedule.status === "em-andamento" && "Em Andamento"}
                        {schedule.status === "concluido" && "Concluído"}
                        {schedule.status === "cancelado" && "Cancelado"}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <p>
                        <span className="text-muted-foreground">Profissional:</span>{" "}
                        <span className="font-medium">{schedule.psychologistName}</span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Paciente:</span>{" "}
                        <span className="font-medium">{schedule.patientName}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nenhum agendamento para hoje
              </p>
            )}
          </div>

          {/* Ações */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onEdit(room);
                onOpenChange(false);
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Editar Sala
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
