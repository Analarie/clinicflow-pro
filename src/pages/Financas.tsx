import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Payment, Expense } from "@/types/finance";
import { Plus, DollarSign, TrendingUp, TrendingDown, CreditCard } from "lucide-react";
import { PaymentDialog } from "@/components/finance/PaymentDialog";
import { ExpenseDialog } from "@/components/finance/ExpenseDialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockPayments: Payment[] = [
  {
    id: "1",
    patientId: "1",
    patientName: "André Ferreira",
    appointmentId: "1",
    amount: 200,
    date: new Date(),
    method: "pix",
    status: "paid",
    description: "Consulta psicológica",
  },
  {
    id: "2",
    patientId: "2",
    patientName: "Paulo Matos",
    appointmentId: "2",
    amount: 200,
    date: new Date(),
    method: "credit",
    status: "pending",
    description: "Sessão de terapia",
  },
];

const mockExpenses: Expense[] = [
  {
    id: "1",
    description: "Aluguel do consultório",
    amount: 2500,
    category: "Aluguel",
    date: new Date(),
    paymentMethod: "Transferência",
    status: "paid",
  },
  {
    id: "2",
    description: "Material de escritório",
    amount: 350,
    category: "Material",
    date: new Date(),
    paymentMethod: "Cartão",
    status: "pending",
  },
];

const Financas = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const totalReceived = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = expenses
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalReceived - totalExpenses;

  const handleSavePayment = (paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setPayments(prev => [...prev, newPayment]);
    toast.success("Pagamento registrado!");
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses(prev => [...prev, newExpense]);
    toast.success("Despesa registrada!");
  };

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: 'Dinheiro',
      credit: 'Cartão de Crédito',
      debit: 'Cartão de Débito',
      pix: 'PIX',
      insurance: 'Convênio',
    };
    return labels[method] || method;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onNewAppointment={() => {}} />
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Finanças</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Recebido</span>
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <p className="text-2xl font-bold text-success">
                  R$ {totalReceived.toFixed(2)}
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">A Receber</span>
                  <CreditCard className="w-4 h-4 text-warning" />
                </div>
                <p className="text-2xl font-bold text-warning">
                  R$ {totalPending.toFixed(2)}
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Despesas</span>
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
                <p className="text-2xl font-bold text-destructive">
                  R$ {totalExpenses.toFixed(2)}
                </p>
              </div>

              <div className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Saldo</span>
                  <DollarSign className="w-4 h-4 text-primary" />
                </div>
                <p className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                  R$ {balance.toFixed(2)}
                </p>
              </div>
            </div>

            <Tabs defaultValue="payments" className="w-full">
              <TabsList>
                <TabsTrigger value="payments">Recebimentos</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="payments" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setIsPaymentDialogOpen(true)} className="bg-success hover:bg-success/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Recebimento
                  </Button>
                </div>

                <div className="space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{payment.patientName}</h3>
                          <p className="text-sm text-muted-foreground">{payment.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{format(payment.date, "d 'de' MMM, yyyy", { locale: ptBR })}</span>
                            <span>{getPaymentMethodLabel(payment.method)}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              payment.status === 'paid' ? 'bg-success/10 text-success' :
                              payment.status === 'pending' ? 'bg-warning/10 text-warning' :
                              'bg-destructive/10 text-destructive'
                            }`}>
                              {payment.status === 'paid' ? 'Pago' : 
                               payment.status === 'pending' ? 'Pendente' : 'Cancelado'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-success">
                            R$ {payment.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="expenses" className="space-y-4">
                <div className="flex justify-end">
                  <Button onClick={() => setIsExpenseDialogOpen(true)} variant="destructive">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Despesa
                  </Button>
                </div>

                <div className="space-y-2">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-card border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{expense.description}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>{format(expense.date, "d 'de' MMM, yyyy", { locale: ptBR })}</span>
                            <span>{expense.category}</span>
                            <span>{expense.paymentMethod}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              expense.status === 'paid' ? 'bg-success/10 text-success' :
                              'bg-warning/10 text-warning'
                            }`}>
                              {expense.status === 'paid' ? 'Pago' : 'Pendente'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-destructive">
                            R$ {expense.amount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <PaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        onSave={handleSavePayment}
      />

      <ExpenseDialog
        open={isExpenseDialogOpen}
        onOpenChange={setIsExpenseDialogOpen}
        onSave={handleSaveExpense}
      />
    </div>
  );
};

export default Financas;
