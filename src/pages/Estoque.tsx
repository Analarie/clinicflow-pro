import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  lastPurchase?: Date;
  price: number;
}

const mockStock: StockItem[] = [
  {
    id: "1",
    name: "Papel A4",
    category: "Papelaria",
    quantity: 15,
    minQuantity: 5,
    unit: "resmas",
    price: 25.00,
  },
  {
    id: "2",
    name: "Canetas azuis",
    category: "Papelaria",
    quantity: 30,
    minQuantity: 10,
    unit: "unidades",
    price: 2.50,
  },
  {
    id: "3",
    name: "Álcool em gel",
    category: "Higiene",
    quantity: 3,
    minQuantity: 8,
    unit: "frascos",
    price: 15.00,
  },
  {
    id: "4",
    name: "Máscaras descartáveis",
    category: "EPI",
    quantity: 50,
    minQuantity: 20,
    unit: "unidades",
    price: 1.50,
  },
];

const Estoque = () => {
  const [items, setItems] = useState<StockItem[]>(mockStock);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    minQuantity: "",
    unit: "",
    price: "",
  });

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = items.filter(item => item.quantity < item.minQuantity);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.quantity) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const newItem: StockItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      category: formData.category,
      quantity: parseInt(formData.quantity),
      minQuantity: parseInt(formData.minQuantity),
      unit: formData.unit,
      price: parseFloat(formData.price),
    };

    setItems([...items, newItem]);
    toast.success("Item adicionado ao estoque!");
    setIsDialogOpen(false);
    setFormData({
      name: "",
      category: "",
      quantity: "",
      minQuantity: "",
      unit: "",
      price: "",
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Controle de Estoque</h1>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            {lowStockItems.length > 0 && (
              <div className="bg-warning/10 border border-warning rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <h3 className="font-semibold text-warning">Atenção: {lowStockItems.length} itens com estoque baixo</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lowStockItems.map(item => item.name).join(", ")}
                </p>
              </div>
            )}

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Quantidade</p>
                        <p className={`text-xl font-bold ${
                          item.quantity < item.minQuantity ? 'text-warning' : 'text-foreground'
                        }`}>
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Estoque Mínimo</p>
                        <p className="text-xl font-semibold">
                          {item.minQuantity} {item.unit}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Preço Unit.</p>
                        <p className="text-xl font-semibold">
                          R$ {item.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhum item encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Item *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade *</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minQuantity">Mín. *</Label>
                <Input
                  id="minQuantity"
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">Unidade</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="un., kg, L..."
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Preço Unitário (R$)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Estoque;
