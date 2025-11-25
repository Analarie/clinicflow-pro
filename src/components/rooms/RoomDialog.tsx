import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room, RoomStatus } from "@/types/room";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: Room;
  onSave: (room: Partial<Room>) => void;
}

const equipmentOptions = [
  "Sofá",
  "Mesa",
  "Cadeiras",
  "Ar condicionado",
  "Computador",
  "Projetor",
  "Quadro branco",
  "Brinquedos",
  "Materiais didáticos",
  "Impressora",
];

export function RoomDialog({ open, onOpenChange, room, onSave }: RoomDialogProps) {
  const [formData, setFormData] = useState<Partial<Room>>({
    name: "",
    number: "",
    capacity: 2,
    status: "disponivel",
    equipment: [],
    floor: 1,
    notes: "",
  });

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  useEffect(() => {
    if (room) {
      setFormData(room);
      setSelectedEquipment(room.equipment);
    } else {
      setFormData({
        name: "",
        number: "",
        capacity: 2,
        status: "disponivel",
        equipment: [],
        floor: 1,
        notes: "",
      });
      setSelectedEquipment([]);
    }
  }, [room, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, equipment: selectedEquipment });
  };

  const toggleEquipment = (equipment: string) => {
    setSelectedEquipment(prev =>
      prev.includes(equipment)
        ? prev.filter(e => e !== equipment)
        : [...prev, equipment]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{room ? "Editar Sala" : "Nova Sala"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Sala *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Sala 1 - Terapia Individual"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="Ex: 101"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor">Andar *</Label>
              <Input
                id="floor"
                type="number"
                min="1"
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={formData.status}
              onValueChange={(value: RoomStatus) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="ocupada">Ocupada</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
                <SelectItem value="limpeza">Limpeza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Equipamentos</Label>
            <div className="flex flex-wrap gap-2">
              {selectedEquipment.map((eq) => (
                <Badge key={eq} variant="secondary" className="cursor-pointer" onClick={() => toggleEquipment(eq)}>
                  {eq}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
            <Select onValueChange={toggleEquipment}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar equipamento" />
              </SelectTrigger>
              <SelectContent>
                {equipmentOptions.filter(eq => !selectedEquipment.includes(eq)).map((eq) => (
                  <SelectItem key={eq} value={eq}>
                    {eq}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observações sobre a sala..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
