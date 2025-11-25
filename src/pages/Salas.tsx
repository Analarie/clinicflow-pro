import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, DoorOpen, Settings, Calendar, Users } from "lucide-react";
import { RoomDialog } from "@/components/rooms/RoomDialog";
import { RoomDetailsDialog } from "@/components/rooms/RoomDetailsDialog";
import { Room, RoomSchedule } from "@/types/room";
import { cn } from "@/lib/utils";

const mockRooms: Room[] = [
  {
    id: "1",
    name: "Sala 1 - Terapia Individual",
    number: "101",
    capacity: 2,
    status: "ocupada",
    equipment: ["Sofá", "Mesa", "Ar condicionado", "Computador"],
    floor: 1,
    notes: "Sala com vista para o jardim"
  },
  {
    id: "2",
    name: "Sala 2 - Terapia em Grupo",
    number: "102",
    capacity: 8,
    status: "disponivel",
    equipment: ["Cadeiras", "Quadro branco", "Ar condicionado", "Projetor"],
    floor: 1,
  },
  {
    id: "3",
    name: "Sala 3 - Infantil",
    number: "201",
    capacity: 3,
    status: "disponivel",
    equipment: ["Brinquedos", "Mesa baixa", "Ar condicionado", "Materiais didáticos"],
    floor: 2,
    notes: "Decoração lúdica"
  },
  {
    id: "4",
    name: "Sala 4 - Avaliação",
    number: "202",
    capacity: 2,
    status: "manutencao",
    equipment: ["Mesa", "Cadeiras", "Computador", "Impressora"],
    floor: 2,
  },
];

const mockSchedules: RoomSchedule[] = [
  {
    id: "1",
    roomId: "1",
    psychologistId: "1",
    psychologistName: "Dra. Ana Silva",
    patientName: "João Santos",
    startTime: new Date(2025, 0, 25, 10, 0),
    endTime: new Date(2025, 0, 25, 11, 0),
    status: "em-andamento"
  },
  {
    id: "2",
    roomId: "1",
    psychologistId: "1",
    psychologistName: "Dra. Ana Silva",
    patientName: "Maria Costa",
    startTime: new Date(2025, 0, 25, 14, 0),
    endTime: new Date(2025, 0, 25, 15, 0),
    status: "agendado"
  },
  {
    id: "3",
    roomId: "2",
    psychologistId: "2",
    psychologistName: "Dr. Carlos Mendes",
    patientName: "Grupo Ansiedade",
    startTime: new Date(2025, 0, 25, 15, 0),
    endTime: new Date(2025, 0, 25, 16, 30),
    status: "agendado"
  },
];

export default function Salas() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [schedules] = useState<RoomSchedule[]>(mockSchedules);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | undefined>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disponivel":
        return "bg-success text-success-foreground";
      case "ocupada":
        return "bg-destructive text-destructive-foreground";
      case "manutencao":
        return "bg-warning text-warning-foreground";
      case "limpeza":
        return "bg-info text-info-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      disponivel: "Disponível",
      ocupada: "Ocupada",
      manutencao: "Manutenção",
      limpeza: "Limpeza"
    };
    return labels[status] || status;
  };

  const getRoomSchedules = (roomId: string) => {
    return schedules.filter(s => s.roomId === roomId);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.number.includes(searchTerm);
    const matchesStatus = filterStatus === "all" || room.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (room: Partial<Room>) => {
    if (selectedRoom) {
      setRooms(rooms.map(r => r.id === selectedRoom.id ? { ...r, ...room } : r));
    } else {
      const newRoom: Room = {
        id: String(rooms.length + 1),
        ...room as Room
      };
      setRooms([...rooms, newRoom]);
    }
    setIsDialogOpen(false);
    setSelectedRoom(undefined);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const handleViewDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsDetailsOpen(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Controle de Salas</h1>
                <p className="text-muted-foreground mt-1">Gerencie as salas e sua disponibilidade</p>
              </div>
              <Button onClick={() => {
                setSelectedRoom(undefined);
                setIsDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Sala
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar por nome ou número..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => setFilterStatus("all")}
                >
                  Todas
                </Button>
                <Button
                  variant={filterStatus === "disponivel" ? "default" : "outline"}
                  onClick={() => setFilterStatus("disponivel")}
                >
                  Disponíveis
                </Button>
                <Button
                  variant={filterStatus === "ocupada" ? "default" : "outline"}
                  onClick={() => setFilterStatus("ocupada")}
                >
                  Ocupadas
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => {
                const roomSchedules = getRoomSchedules(room.id);
                const currentSchedule = roomSchedules.find(s => s.status === "em-andamento");
                
                return (
                  <Card key={room.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewDetails(room)}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <DoorOpen className="h-5 w-5 text-primary" />
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                        </div>
                        <Badge className={cn(getStatusColor(room.status))}>
                          {getStatusLabel(room.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Número:</span>
                        <span className="font-medium">{room.number}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Andar:</span>
                        <span className="font-medium">{room.floor}º</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Capacidade:
                        </span>
                        <span className="font-medium">{room.capacity} pessoa(s)</span>
                      </div>

                      {currentSchedule && (
                        <div className="mt-3 p-3 bg-muted rounded-lg space-y-1">
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <Calendar className="h-3 w-3" />
                            Em atendimento
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {currentSchedule.psychologistName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Paciente: {currentSchedule.patientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {currentSchedule.startTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {currentSchedule.endTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      )}

                      {!currentSchedule && roomSchedules.length > 0 && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
                          {roomSchedules.length} agendamento(s) hoje
                        </div>
                      )}

                      <div className="pt-2 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(room);
                          }}
                        >
                          <Settings className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredRooms.length === 0 && (
              <div className="text-center py-12">
                <DoorOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Nenhuma sala encontrada</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros ou adicione uma nova sala.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <RoomDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        room={selectedRoom}
        onSave={handleSave}
      />

      <RoomDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        room={selectedRoom}
        schedules={selectedRoom ? getRoomSchedules(selectedRoom.id) : []}
        onEdit={handleEdit}
      />
    </div>
  );
}
