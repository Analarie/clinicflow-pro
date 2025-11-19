import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Appointment, Psychologist } from "@/types/appointment";
import { format } from "date-fns";
import { toast } from "sonner";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  psychologists: Psychologist[];
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  editAppointment?: Appointment | null;
}

export const AppointmentDialog = ({
  open,
  onOpenChange,
  psychologists,
  onSave,
  editAppointment,
}: AppointmentDialogProps) => {
  const [formData, setFormData] = useState({
    patientName: editAppointment?.patientName || "",
    psychologistId: editAppointment?.psychologistId || "",
    date: editAppointment ? format(editAppointment.date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
    startTime: editAppointment?.startTime || "09:00",
    endTime: editAppointment?.endTime || "10:00",
    type: editAppointment?.type || "consulta" as const,
    status: editAppointment?.status || "confirmado" as const,
    notes: editAppointment?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.psychologistId) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const psychologist = psychologists.find(p => p.id === formData.psychologistId);
    
    onSave({
      ...formData,
      psychologistName: psychologist?.name || "",
      date: new Date(formData.date),
    });
    
    toast.success(editAppointment ? "Agendamento atualizado!" : "Agendamento criado!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Nome do Paciente *</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="psychologist">Psicólogo *</Label>
              <Select
                value={formData.psychologistId}
                onValueChange={(value) => setFormData({ ...formData, psychologistId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o psicólogo" />
                </SelectTrigger>
                <SelectContent>
                  {psychologists.map((psy) => (
                    <SelectItem key={psy.id} value={psy.id}>
                      {psy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Horário Início *</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Horário Fim *</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Consulta</Label>
              <Select
                value={formData.type}
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consulta">Consulta</SelectItem>
                  <SelectItem value="retorno">Retorno</SelectItem>
                  <SelectItem value="avaliacao">Avaliação</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editAppointment ? 'Salvar Alterações' : 'Criar Agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
