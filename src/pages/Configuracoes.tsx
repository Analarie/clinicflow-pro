import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Building, Users, Bell, Lock, Palette, Database } from "lucide-react";

const Configuracoes = () => {
  const [clinicName, setClinicName] = useState("Clínica Zen Flow");
  const [clinicPhone, setClinicPhone] = useState("(11) 3456-7890");
  const [clinicEmail, setClinicEmail] = useState("contato@zenflow.com.br");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState("24");

  const handleSaveClinicInfo = () => {
    toast.success("Informações da clínica atualizadas!");
  };

  const handleSaveNotifications = () => {
    toast.success("Preferências de notificação atualizadas!");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Configurações</h1>

            <Tabs defaultValue="clinic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="clinic">Clínica</TabsTrigger>
                <TabsTrigger value="users">Usuários</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
              </TabsList>
              
              <TabsContent value="clinic" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      <CardTitle>Informações da Clínica</CardTitle>
                    </div>
                    <CardDescription>
                      Gerencie as informações básicas da sua clínica
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Nome da Clínica</Label>
                      <Input
                        id="clinicName"
                        value={clinicName}
                        onChange={(e) => setClinicName(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicPhone">Telefone</Label>
                        <Input
                          id="clinicPhone"
                          value={clinicPhone}
                          onChange={(e) => setClinicPhone(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clinicEmail">E-mail</Label>
                        <Input
                          id="clinicEmail"
                          type="email"
                          value={clinicEmail}
                          onChange={(e) => setClinicEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="clinicAddress">Endereço</Label>
                      <Input
                        id="clinicAddress"
                        placeholder="Rua, número, bairro"
                      />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicCity">Cidade</Label>
                        <Input id="clinicCity" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clinicState">Estado</Label>
                        <Input id="clinicState" maxLength={2} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="clinicZip">CEP</Label>
                        <Input id="clinicZip" />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveClinicInfo}>
                      Salvar Alterações
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="users" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      <CardTitle>Gerenciamento de Usuários</CardTitle>
                    </div>
                    <CardDescription>
                      Adicione e gerencie psicólogos e funcionários
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {[
                        { name: "Dr. Rodrigo Peixoto", role: "Psicólogo", status: "Ativo" },
                        { name: "Dra. Ana Silva", role: "Psicóloga", status: "Ativo" },
                        { name: "Dr. Carlos Santos", role: "Neuropsicólogo", status: "Ativo" },
                      ].map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-semibold">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.role}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-success">{user.status}</span>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full">
                      Adicionar Novo Usuário
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      <CardTitle>Notificações</CardTitle>
                    </div>
                    <CardDescription>
                      Configure como e quando receber notificações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por E-mail</Label>
                        <p className="text-sm text-muted-foreground">
                          Receba lembretes de consultas por e-mail
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificações por SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Envie lembretes de consultas por SMS
                        </p>
                      </div>
                      <Switch
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reminderTime">Tempo de Antecedência para Lembretes</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="reminderTime"
                          type="number"
                          value={reminderTime}
                          onChange={(e) => setReminderTime(e.target.value)}
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">horas antes</span>
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveNotifications}>
                      Salvar Preferências
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5" />
                      <CardTitle>Segurança</CardTitle>
                    </div>
                    <CardDescription>
                      Gerencie senha e configurações de segurança
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nova Senha</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                    
                    <Button>
                      Alterar Senha
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      <CardTitle>Aparência</CardTitle>
                    </div>
                    <CardDescription>
                      Personalize a aparência do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tema</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20">
                          Modo Claro
                        </Button>
                        <Button variant="outline" className="h-20">
                          Modo Escuro
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Cor Principal</Label>
                      <div className="flex gap-2">
                        {['#0088cc', '#22c55e', '#8b5cf6', '#ef4444', '#f59e0b'].map((color) => (
                          <button
                            key={color}
                            className="w-10 h-10 rounded-full border-2 border-border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
