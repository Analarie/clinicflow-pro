import { Appointment } from "@/types/appointment";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface ListViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
}

const getAppointmentColor = (type: string, status: string) => {
  if (status === 'cancelado') return 'border-l-destructive';
  
  switch (type) {
    case 'consulta':
      return 'border-l-success';
    case 'retorno':
      return 'border-l-info';
    case 'avaliacao':
      return 'border-l-primary';
    case 'urgente':
      return 'border-l-destructive';
    default:
      return 'border-l-primary';
  }
};

export const ListView = ({ appointments, onAppointmentClick }: ListViewProps) => {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const timeA = a.startTime.replace(':', '');
    const timeB = b.startTime.replace(':', '');
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="flex-1 overflow-auto p-4 bg-background">
      <div className="max-w-4xl mx-auto space-y-4">
        <h2 className="text-lg font-semibold mb-4">Pacientes de hoje</h2>
        
        <div className="space-y-2">
          {sortedAppointments.map((apt) => (
            <div
              key={apt.id}
              onClick={() => onAppointmentClick(apt)}
              className={cn(
                "bg-card border-l-4 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow",
                getAppointmentColor(apt.type, apt.status)
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">{apt.startTime} - {apt.endTime}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{apt.patientName}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Psicólogo: {apt.psychologistName}</span>
                    <span className="capitalize">Tipo: {apt.type}</span>
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium",
                      apt.status === 'confirmado' && "bg-success/10 text-success",
                      apt.status === 'pendente' && "bg-warning/10 text-warning",
                      apt.status === 'cancelado' && "bg-destructive/10 text-destructive",
                      apt.status === 'concluido' && "bg-muted text-muted-foreground"
                    )}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {sortedAppointments.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum agendamento para hoje</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
