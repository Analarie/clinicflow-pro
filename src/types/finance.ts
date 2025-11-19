export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId: string;
  amount: number;
  date: Date;
  method: 'cash' | 'credit' | 'debit' | 'pix' | 'insurance';
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  description: string;
  invoice?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  paymentMethod: string;
  status: 'pending' | 'paid';
}
