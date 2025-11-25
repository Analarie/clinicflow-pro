import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Download, Eye, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

interface Budget {
  id: string;
  patientName: string;
  date: Date;
  services: { description: string; quantity: number; price: number }[];
  total: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  validUntil: Date;
}

const mockBudgets: Budget[] = [
  {
    id: "1",
    patientName: "André Ferreira",
    date: new Date(),
    services: [
      { description: "Sessões de terapia individual (10x)", quantity: 10, price: 200 },
      { description: "Avaliação psicológica", quantity: 1, price: 400 },
    ],
    total: 2400,
    status: "sent",
    validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    patientName: "Paulo Matos",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    services: [
      { description: "Sessões de terapia em grupo (8x)", quantity: 8, price: 150 },
    ],
    total: 1200,
    status: "approved",
    validUntil: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
  },
];

const Orcamentos = () => {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [services, setServices] = useState([{ description: "", quantity: 1, price: 0 }]);
  const [patientName, setPatientName] = useState("");
  const [validDays, setValidDays] = useState("15");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const addService = () => {
    setServices([...services, { description: "", quantity: 1, price: 0 }]);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const updateService = (index: number, field: string, value: any) => {
    const newServices = [...services];
    newServices[index] = { ...newServices[index], [field]: value };
    setServices(newServices);
  };

  const calculateTotal = () => {
    return services.reduce((sum, service) => sum + (service.quantity * service.price), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName || services.some(s => !s.description)) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newBudget: Budget = {
      id: Math.random().toString(36).substr(2, 9),
      patientName,
      date: new Date(),
      services,
      total: calculateTotal(),
      status: "draft",
      validUntil: new Date(Date.now() + parseInt(validDays) * 24 * 60 * 60 * 1000),
    };

    setBudgets([newBudget, ...budgets]);
    toast.success("Orçamento criado com sucesso!");
    setIsDialogOpen(false);
    setPatientName("");
    setServices([{ description: "", quantity: 1, price: 0 }]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'sent': return 'bg-info/10 text-info';
      case 'approved': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Rascunho',
      sent: 'Enviado',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };
    return labels[status] || status;
  };

  const filteredBudgets = budgets.filter(budget => {
    const statusMatch = statusFilter === "all" || budget.status === statusFilter;
    const searchMatch = searchQuery === "" || 
      budget.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    
    let dateMatch = true;
    if (dateFilter === "month") {
      const now = new Date();
      dateMatch = isWithinInterval(budget.date, { 
        start: startOfMonth(now), 
        end: endOfMonth(now) 
      });
    }
    
    return statusMatch && searchMatch && dateMatch;
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Orçamentos</h1>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Orçamento
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Buscar por paciente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="sent">Enviado</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os períodos</SelectItem>
                    <SelectItem value="month">Este mês</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{budget.patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Criado em {format(budget.date, "d 'de' MMM, yyyy", { locale: ptBR })}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {budget.services.map((service, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {service.description}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Válido até {format(budget.validUntil, "d 'de' MMM, yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">R$ {budget.total.toFixed(2)}</p>
                      </div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(budget.status)}`}>
                        {getStatusLabel(budget.status)}
                      </span>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBudgets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum orçamento encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Orçamento</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Paciente *</Label>
              <Input
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="validDays">Validade (dias)</Label>
              <Input
                id="validDays"
                type="number"
                value={validDays}
                onChange={(e) => setValidDays(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Serviços</Label>
                <Button type="button" variant="outline" size="sm" onClick={addService}>
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </div>

              {services.map((service, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-6 space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={service.description}
                      onChange={(e) => updateService(index, 'description', e.target.value)}
                      placeholder="Ex: Sessão de terapia individual"
                    />
                  </div>
                  
                  <div className="col-span-2 space-y-2">
                    <Label>Qtd.</Label>
                    <Input
                      type="number"
                      min="1"
                      value={service.quantity}
                      onChange={(e) => updateService(index, 'quantity', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="col-span-3 space-y-2">
                    <Label>Valor Unit.</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={service.price}
                      onChange={(e) => updateService(index, 'price', parseFloat(e.target.value))}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    {services.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold">R$ {calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Orçamento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orcamentos;
