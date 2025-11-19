import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, Download, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface TISSGuide {
  id: string;
  patientName: string;
  insuranceName: string;
  guideNumber: string;
  date: Date;
  procedures: string[];
  value: number;
  status: 'pending' | 'sent' | 'approved' | 'rejected';
}

const mockGuides: TISSGuide[] = [
  {
    id: "1",
    patientName: "André Ferreira",
    insuranceName: "Unimed",
    guideNumber: "2024001234",
    date: new Date(),
    procedures: ["Psicoterapia individual"],
    value: 200,
    status: "approved",
  },
  {
    id: "2",
    patientName: "Paulo Matos",
    insuranceName: "Amil",
    guideNumber: "2024001235",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    procedures: ["Psicoterapia individual", "Avaliação psicológica"],
    value: 400,
    status: "pending",
  },
  {
    id: "3",
    patientName: "Maria Silva",
    insuranceName: "Bradesco Saúde",
    guideNumber: "2024001236",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    procedures: ["Psicoterapia individual"],
    value: 200,
    status: "rejected",
  },
];

const TISS = () => {
  const [guides, setGuides] = useState<TISSGuide[]>(mockGuides);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    insuranceName: "",
    guideNumber: "",
    procedures: "",
    value: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.insuranceName) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newGuide: TISSGuide = {
      id: Math.random().toString(36).substr(2, 9),
      patientName: formData.patientName,
      insuranceName: formData.insuranceName,
      guideNumber: formData.guideNumber,
      date: new Date(),
      procedures: formData.procedures.split(',').map(p => p.trim()),
      value: parseFloat(formData.value),
      status: "pending",
    };

    setGuides([newGuide, ...guides]);
    toast.success("Guia TISS criada com sucesso!");
    setIsDialogOpen(false);
    setFormData({
      patientName: "",
      insuranceName: "",
      guideNumber: "",
      procedures: "",
      value: "",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'sent': return <Upload className="w-5 h-5 text-info" />;
      case 'approved': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-destructive" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
      sent: 'Enviado',
      approved: 'Aprovado',
      rejected: 'Rejeitado',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning/10 text-warning';
      case 'sent': return 'bg-info/10 text-info';
      case 'approved': return 'bg-success/10 text-success';
      case 'rejected': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalPending = guides.filter(g => g.status === 'pending').reduce((sum, g) => sum + g.value, 0);
  const totalApproved = guides.filter(g => g.status === 'approved').reduce((sum, g) => sum + g.value, 0);
  const totalRejected = guides.filter(g => g.status === 'rejected').reduce((sum, g) => sum + g.value, 0);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">TISS - Troca de Informações em Saúde Suplementar</h1>
                <p className="text-muted-foreground mt-1">Gerencie guias e faturamento de convênios</p>
              </div>
              <Button onClick={() => setIsDialogOpen(true)}>
                <FileText className="w-4 h-4 mr-2" />
                Nova Guia
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pendente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-warning">
                    R$ {totalPending.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {guides.filter(g => g.status === 'pending').length} guias
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Aprovado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-success">
                    R$ {totalApproved.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {guides.filter(g => g.status === 'approved').length} guias
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rejeitado</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    R$ {totalRejected.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {guides.filter(g => g.status === 'rejected').length} guias
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getStatusIcon(guide.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{guide.patientName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(guide.status)}`}>
                            {getStatusLabel(guide.status)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {guide.insuranceName} • Guia nº {guide.guideNumber}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {guide.procedures.map((proc, idx) => (
                            <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">
                              {proc}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(guide.date, "d 'de' MMM 'de' yyyy", { locale: ptBR })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xl font-bold">R$ {guide.value.toFixed(2)}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          XML
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {guides.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma guia TISS criada</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Guia TISS</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Paciente *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceName">Convênio *</Label>
                <Select
                  value={formData.insuranceName}
                  onValueChange={(value) => setFormData({ ...formData, insuranceName: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unimed">Unimed</SelectItem>
                    <SelectItem value="Amil">Amil</SelectItem>
                    <SelectItem value="Bradesco Saúde">Bradesco Saúde</SelectItem>
                    <SelectItem value="SulAmérica">SulAmérica</SelectItem>
                    <SelectItem value="Porto Seguro">Porto Seguro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guideNumber">Número da Guia</Label>
              <Input
                id="guideNumber"
                value={formData.guideNumber}
                onChange={(e) => setFormData({ ...formData, guideNumber: e.target.value })}
                placeholder="Ex: 2024001234"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="procedures">Procedimentos (separados por vírgula)</Label>
              <Input
                id="procedures"
                value={formData.procedures}
                onChange={(e) => setFormData({ ...formData, procedures: e.target.value })}
                placeholder="Ex: Psicoterapia individual, Avaliação psicológica"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor Total (R$)</Label>
              <Input
                id="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Criar Guia
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TISS;
