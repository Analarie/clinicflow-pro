export type RoomStatus = "disponivel" | "ocupada" | "manutencao" | "limpeza";

export interface Room {
  id: string;
  name: string;
  number: string;
  capacity: number;
  status: RoomStatus;
  equipment: string[];
  floor: number;
  notes?: string;
}

export interface RoomSchedule {
  id: string;
  roomId: string;
  psychologistId: string;
  psychologistName: string;
  patientName: string;
  startTime: Date;
  endTime: Date;
  status: "agendado" | "em-andamento" | "concluido" | "cancelado";
}
