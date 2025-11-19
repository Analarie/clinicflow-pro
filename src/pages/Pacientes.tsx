import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Patient } from "@/types/patient";
import { Plus, Search, FileText, Calendar, Phone, Mail } from "lucide-react";
import { PatientDialog } from "@/components/patients/PatientDialog";
import { PatientDetailsDialog } from "@/components/patients/PatientDetailsDialog";
import { toast } from "sonner";

const mockPatients: Patient[] = [
  {
    id: "1",
    name: "André Ferreira",
    cpf: "123.456.789-00",
    birthDate: new Date("1990-05-15"),
    email: "andre@email.com",
    phone: "(11) 98765-4321",
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",
    emergencyContact: "Maria Ferreira",
    emergencyPhone: "(11) 98765-1234",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    status: "active",
    createdAt: new Date("2024-01-15"),
    totalAppointments: 12,
    lastAppointment: new Date("2024-12-01"),
  },
  {
    id: "2",
    name: "Paulo Matos",
    cpf: "987.654.321-00",
    birthDate: new Date("1985-08-20"),
    email: "paulo@email.com",
    phone: "(11) 91234-5678",
    address: "Av. Paulista, 456",
    city: "São Paulo",
    state: "SP",
    zipCode: "01310-100",
    emergencyContact: "Ana Matos",
    emergencyPhone: "(11) 91234-1234",
    psychologistId: "1",
    psychologistName: "Dr. Rodrigo Peixoto",
    status: "active",
    createdAt: new Date("2024-02-10"),
    totalAppointments: 8,
    lastAppointment: new Date("2024-11-28"),
  },
];

const Pacientes = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.cpf.includes(searchTerm) ||
      patient.phone.includes(searchTerm)
  );

  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'totalAppointments'>) => {
    if (editingPatient) {
      setPatients(prev =>
        prev.map(p =>
          p.id === editingPatient.id
            ? { ...patientData, id: p.id, createdAt: p.createdAt, totalAppointments: p.totalAppointments }
            : p
        )
      );
      toast.success("Paciente atualizado!");
    } else {
      const newPatient: Patient = {
        ...patientData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        totalAppointments: 0,
      };
      setPatients(prev => [...prev, newPatient]);
      toast.success("Paciente cadastrado!");
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
  };

  const handleEditPatient = () => {
    setEditingPatient(selectedPatient);
    setIsDetailsOpen(false);
    setIsDialogOpen(true);
  };

  const handleNewPatient = () => {
    setEditingPatient(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={handleNewPatient} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Pacientes</h1>
              <Button onClick={handleNewPatient} className="bg-success hover:bg-success/90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Paciente
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, CPF ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient)}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{patient.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          patient.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {patient.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          <span>{patient.cpf}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <span>{patient.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{patient.totalAppointments} consultas</span>
                        </div>
                      </div>
                      
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Psicólogo: </span>
                        <span className="font-medium">{patient.psychologistName}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredPatients.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum paciente encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <PatientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSavePatient}
        editPatient={editingPatient}
      />

      <PatientDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        patient={selectedPatient}
        onEdit={handleEditPatient}
      />
    </div>
  );
};

export default Pacientes;
