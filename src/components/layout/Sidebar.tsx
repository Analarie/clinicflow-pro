import { Calendar, Users, DollarSign, Package, FileText, ClipboardList, BarChart3, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Calendar, label: "Agenda", path: "/" },
  { icon: Users, label: "Pacientes", path: "/pacientes" },
  { icon: DollarSign, label: "Finanças", path: "/financas" },
  { icon: Package, label: "Estoque", path: "/estoque" },
  { icon: FileText, label: "Orçamentos", path: "/orcamentos" },
  { icon: ClipboardList, label: "TISS", path: "/tiss" },
  { icon: BarChart3, label: "Estatísticas", path: "/estatisticas" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
];

export const Sidebar = () => {
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
    </aside>
  );
};
