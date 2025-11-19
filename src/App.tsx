import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="text-center">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      <p className="text-xl text-muted-foreground">Página em desenvolvimento</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/pacientes" element={<PlaceholderPage title="Pacientes" />} />
          <Route path="/financas" element={<PlaceholderPage title="Finanças" />} />
          <Route path="/estoque" element={<PlaceholderPage title="Estoque" />} />
          <Route path="/orcamentos" element={<PlaceholderPage title="Orçamentos" />} />
          <Route path="/tiss" element={<PlaceholderPage title="TISS" />} />
          <Route path="/estatisticas" element={<PlaceholderPage title="Estatísticas" />} />
          <Route path="/configuracoes" element={<PlaceholderPage title="Configurações" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
