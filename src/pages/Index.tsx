import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ScheduleHeader } from "@/components/schedule/ScheduleHeader";
import { WeekView } from "@/components/schedule/WeekView";
import { ListView } from "@/components/schedule/ListView";
import { AppointmentDialog } from "@/components/schedule/AppointmentDialog";
import { AppointmentDetailsDialog } from "@/components/schedule/AppointmentDetailsDialog";
import { ViewMode, Appointment, Psychologist } from "@/types/appointment";
import { toast } from "sonner";

// Mock data
const psychologists: Psychologist[] = [
  { id: "1", name: "Dr. Rodrigo Peixoto", specialty: "Psicologia Clínica", color: "#0088cc" },
  { id: "2", name: "Dra. Ana Silva", specialty: "Psicologia Infantil", color: "#22c55e" },
  { id: "3", name: "Dr. Carlos Santos", specialty: "Neuropsicologia", color: "#8b5cf6" },
];

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "André Ferreira",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    date: new Date(),
    startTime: "07:00",
    endTime: "07:30",
    type: "consulta",
    status: "confirmado",
  },
  {
    id: "2",
    patientName: "Marcelo Carvalho",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    date: new Date(),
    startTime: "07:00",
    endTime: "08:00",
    type: "consulta",
    status: "confirmado",
  },
  {
    id: "3",
    patientName: "Paulo Matos",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    date: new Date(),
    startTime: "07:30",
    endTime: "08:00",
    type: "retorno",
    status: "confirmado",
  },
  {
    id: "4",
    patientName: "Delia",
    psychologistId: "2",
    psychologistName: "Dra. Ana Silva",
    date: new Date(),
    startTime: "08:00",
    endTime: "08:30",
    type: "consulta",
    status: "confirmado",
  },
  {
    id: "5",
    patientName: "João Retorno",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    date: new Date(),
    startTime: "08:30",
    endTime: "09:00",
    type: "retorno",
    status: "confirmado",
  },
  {
    id: "6",
    patientName: "Pedro Souza",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    date: new Date(),
    startTime: "09:00",
    endTime: "09:30",
    type: "consulta",
    status: "confirmado",
  },
  {
    id: "7",
    patientName: "Renata Nascimento",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    date: new Date(),
    startTime: "09:00",
    endTime: "09:30",
    type: "retorno",
    status: "confirmado",
  },
];

const Index = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPsychologist, setSelectedPsychologist] = useState<string>("1");
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const filteredAppointments = selectedPsychologist === "all" 
    ? appointments 
    : appointments.filter(apt => apt.psychologistId === selectedPsychologist);

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setIsAppointmentDialogOpen(true);
  };

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === editingAppointment.id
            ? { ...appointmentData, id: apt.id }
            : apt
        )
      );
    } else {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: Math.random().toString(36).substr(2, 9),
      };
      setAppointments(prev => [...prev, newAppointment]);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDialogOpen(true);
  };

  const handleEditAppointment = () => {
    setEditingAppointment(selectedAppointment);
    setIsDetailsDialogOpen(false);
    setIsAppointmentDialogOpen(true);
  };

  const handleDeleteAppointment = () => {
    if (selectedAppointment) {
      setAppointments(prev =>
        prev.map(apt =>
          apt.id === selectedAppointment.id
            ? { ...apt, status: 'cancelado' as const }
            : apt
        )
      );
      toast.success("Agendamento cancelado");
      setIsDetailsDialogOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={handleNewAppointment} />
        
        <ScheduleHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedPsychologist={selectedPsychologist}
          onPsychologistChange={setSelectedPsychologist}
          psychologists={psychologists}
          onNewAppointment={handleNewAppointment}
        />
        
        {viewMode === 'list' ? (
          <ListView
            appointments={filteredAppointments}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <WeekView
            appointments={filteredAppointments}
            selectedDate={selectedDate}
            onAppointmentClick={handleAppointmentClick}
          />
        )}
      </div>

      <AppointmentDialog
        open={isAppointmentDialogOpen}
        onOpenChange={setIsAppointmentDialogOpen}
        psychologists={psychologists}
        onSave={handleSaveAppointment}
        editAppointment={editingAppointment}
      />

      <AppointmentDetailsDialog
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
        appointment={selectedAppointment}
        onEdit={handleEditAppointment}
        onDelete={handleDeleteAppointment}
      />
    </div>
  );
};

export default Index;
