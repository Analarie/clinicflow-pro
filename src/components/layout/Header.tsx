import { Plus, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onNewAppointment?: () => void;
}

export const Header = ({ onNewAppointment }: HeaderProps) => {
  return (
    <header className="h-16 bg-primary text-primary-foreground flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <Plus className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
          <Search className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm">+ Mais</span>
        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
          Suporte
        </Button>
        <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/80">
          Clínica Vida
        </Button>
        <div className="flex items-center gap-2">
          <User className="w-5 h-5" />
          <span className="text-sm">Dr. Rodrigo Peixoto</span>
        </div>
      </div>
    </header>
  );
};
