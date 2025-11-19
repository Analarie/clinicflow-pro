export interface Appointment {
  id: string;
  patientName: string;
  psychologistId: string;
  psychologistName: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'consulta' | 'retorno' | 'avaliacao' | 'urgente';
  status: 'confirmado' | 'pendente' | 'cancelado' | 'concluido';
  notes?: string;
}

export interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  color: string;
}

export type ViewMode = 'day' | 'week' | 'month' | 'list';
