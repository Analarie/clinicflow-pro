import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Patient } from "@/types/patient";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { User, Calendar, Phone, Mail, MapPin, AlertCircle, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PatientDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: Patient | null;
  onEdit: () => void;
}

export const PatientDetailsDialog = ({
  open,
  onOpenChange,
  patient,
  onEdit,
}: PatientDetailsDialogProps) => {
  if (!patient) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes do Paciente</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="medical">Dados Médicos</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Nome Completo</p>
                  <p className="font-semibold">{patient.name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-semibold">{patient.cpf}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                  <p className="font-semibold">
                    {format(patient.birthDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-semibold">{patient.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">E-mail</p>
                  <p className="font-semibold">{patient.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-semibold">
                    {patient.address}<br />
                    {patient.city} - {patient.state}<br />
                    CEP: {patient.zipCode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Contato de Emergência</p>
                  <p className="font-semibold">
                    {patient.emergencyContact} - {patient.emergencyPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Psicólogo Responsável</p>
                  <p className="font-semibold">{patient.psychologistName}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medical" className="space-y-4 mt-4">
            <div className="space-y-4">
              {patient.medicalHistory && (
                <div>
                  <h4 className="font-semibold mb-2">Histórico Médico</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {patient.medicalHistory}
                  </p>
                </div>
              )}

              {patient.allergies && (
                <div>
                  <h4 className="font-semibold mb-2">Alergias</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {patient.allergies}
                  </p>
                </div>
              )}

              {patient.medications && (
                <div>
                  <h4 className="font-semibold mb-2">Medicações em Uso</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {patient.medications}
                  </p>
                </div>
              )}

              {!patient.medicalHistory && !patient.allergies && !patient.medications && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhuma informação médica registrada
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="text-sm">Total de Consultas</span>
                <span className="font-semibold">{patient.totalAppointments}</span>
              </div>
              
              {patient.lastAppointment && (
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm">Última Consulta</span>
                  <span className="font-semibold">
                    {format(patient.lastAppointment, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-muted rounded">
                <span className="text-sm">Cadastrado em</span>
                <span className="font-semibold">
                  {format(patient.createdAt, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEdit}>
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
