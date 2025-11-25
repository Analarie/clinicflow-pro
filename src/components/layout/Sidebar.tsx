import { Calendar, Users, DollarSign, Package, FileText, ClipboardList, BarChart3, Settings, DoorOpen, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { icon: Calendar, label: "Agenda", path: "/" },
  { icon: DoorOpen, label: "Salas", path: "/salas" },
  { icon: Users, label: "Pacientes", path: "/pacientes" },
  { icon: DollarSign, label: "Finanças", path: "/financas" },
  { icon: Package, label: "Estoque", path: "/estoque" },
  { icon: FileText, label: "Orçamentos", path: "/orcamentos" },
  { icon: ClipboardList, label: "TISS", path: "/tiss" },
  { icon: BarChart3, label: "Estatísticas", path: "/estatisticas" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">ZF</span>
          </div>
          <span className="font-semibold text-lg">Clínica Zen Flow</span>
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-3 px-2"
          onClick={() => navigate("/perfil")}
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary">
              RP
            </AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <p className="text-sm font-medium">Dr. Rodrigo Peixoto</p>
            <p className="text-xs text-muted-foreground">Ver perfil</p>
          </div>
        </Button>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            activeClassName="bg-primary/10 text-primary font-medium"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
