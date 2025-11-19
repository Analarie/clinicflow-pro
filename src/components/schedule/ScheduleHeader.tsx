import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ViewMode, Psychologist } from "@/types/appointment";

interface ScheduleHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  selectedPsychologist: string;
  onPsychologistChange: (id: string) => void;
  psychologists: Psychologist[];
  onNewAppointment: () => void;
}

export const ScheduleHeader = ({
  viewMode,
  onViewModeChange,
  selectedDate,
  onDateChange,
  selectedPsychologist,
  onPsychologistChange,
  psychologists,
  onNewAppointment,
}: ScheduleHeaderProps) => {
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    onDateChange(newDate);
  };

  const getDateRangeLabel = () => {
    if (viewMode === 'list') return 'Pacientes de hoje';
    
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);
    
    if (viewMode === 'week') {
      end.setDate(end.getDate() + 6);
      return `${format(start, 'd', { locale: ptBR })} - ${format(end, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`;
    }
    
    if (viewMode === 'month') {
      return format(selectedDate, "MMMM 'de' yyyy", { locale: ptBR });
    }
    
    return format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="bg-background border-b border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          AGENDA - {psychologists.find(p => p.id === selectedPsychologist)?.name.toUpperCase() || 'TODOS'}
        </h1>
        
        <div className="flex items-center gap-2">
          <Select value={selectedPsychologist} onValueChange={onPsychologistChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Psicólogos</SelectItem>
              {psychologists.map((psy) => (
                <SelectItem key={psy.id} value={psy.id}>
                  {psy.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <CalendarIcon className="w-4 h-4" />
          </Button>
          
          <Button onClick={onNewAppointment} className="bg-success hover:bg-success/90">
            <Plus className="w-4 h-4 mr-2" />
            NOVO AGENDAMENTO
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{viewMode === 'list' ? 'Pacientes de hoje' : ''}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'day' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('day')}
              className="rounded-none"
            >
              Dia
            </Button>
            <Button
              variant={viewMode === 'week' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('week')}
              className="rounded-none border-x"
            >
              Semana
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('month')}
              className="rounded-none"
            >
              Mês
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="rounded-none border-l"
            >
              Lista
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[200px] text-center">
              {getDateRangeLabel()}
            </span>
            <Button variant="outline" size="icon" onClick={() => navigateDate('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button variant="outline" size="icon">
            <Printer className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
