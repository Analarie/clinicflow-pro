export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: Date;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory?: string;
  allergies?: string;
  medications?: string;
  psychologistId: string;
  psychologistName: string;
  status: 'active' | 'inactive' | 'archived';
  createdAt: Date;
  totalAppointments: number;
  lastAppointment?: Date;
}

export interface PatientRecord {
  id: string;
  patientId: string;
  date: Date;
  psychologistId: string;
  psychologistName: string;
  sessionNotes: string;
  diagnosis?: string;
  treatment?: string;
}
