import { Appointment } from "@/types/appointment";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface WeekViewProps {
  appointments: Appointment[];
  selectedDate: Date;
  onAppointmentClick: (appointment: Appointment) => void;
}

const timeSlots = [
  "07:00", "07:30", "08:00", "08:30", "09:00", "09:30",
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
];

const getAppointmentColor = (type: string, status: string) => {
  if (status === 'cancelado') return 'bg-destructive text-destructive-foreground';
  
  switch (type) {
    case 'consulta':
      return 'bg-success text-success-foreground';
    case 'retorno':
      return 'bg-info text-info-foreground';
    case 'avaliacao':
      return 'bg-primary text-primary-foreground';
    case 'urgente':
      return 'bg-destructive text-destructive-foreground';
    default:
      return 'bg-primary text-primary-foreground';
  }
};

export const WeekView = ({ appointments, selectedDate, onAppointmentClick }: WeekViewProps) => {
  const weekStart = startOfWeek(selectedDate, { locale: ptBR });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getAppointmentsForSlot = (day: Date, time: string) => {
    return appointments.filter(apt => {
      const aptTime = apt.startTime.substring(0, 5);
      return isSameDay(apt.date, day) && aptTime === time;
    });
  };

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="min-w-[1200px]">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-background z-10">
          <div className="p-2 border-r border-border"></div>
          {weekDays.map((day, i) => (
            <div key={i} className="p-2 text-center border-r border-border">
              <div className="font-semibold text-sm">
                {format(day, 'EEE', { locale: ptBR }).toUpperCase()} {format(day, 'd/M')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map((time, timeIndex) => (
          <div key={time} className="grid grid-cols-8 border-b border-border">
            <div className="p-2 text-xs text-muted-foreground border-r border-border text-right pr-3">
              {time}
            </div>
            {weekDays.map((day, dayIndex) => {
              const slotAppointments = getAppointmentsForSlot(day, time);
              return (
                <div
                  key={dayIndex}
                  className="border-r border-border p-1 min-h-[60px] hover:bg-accent/50 cursor-pointer"
                >
                  {slotAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => onAppointmentClick(apt)}
                      className={cn(
                        "text-xs p-2 rounded mb-1 cursor-pointer hover:opacity-90 transition-opacity",
                        getAppointmentColor(apt.type, apt.status)
                      )}
                    >
                      <div className="font-semibold truncate">{apt.startTime} - {apt.endTime}</div>
                      <div className="truncate">{apt.patientName}</div>
                      <div className="truncate capitalize">{apt.type}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
