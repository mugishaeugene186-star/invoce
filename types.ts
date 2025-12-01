export enum InvoiceStatus {
    PAID = 'Paid',
    PENDING = 'Pending',
    OVERDUE = 'Overdue',
    DRAFT = 'Draft'
  }
  
  export interface LineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }
  
  export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  }
  
  export interface Invoice {
    id: string;
    number: string;
    date: string;
    dueDate: string;
    customer: Customer;
    items: LineItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: InvoiceStatus;
    currency: string;
    paymentLink?: string;
  }
  
  export interface DashboardStats {
    totalRevenue: number;
    pendingAmount: number;
    totalInvoices: number;
    overdueCount: number;
  }
  
  export type ViewState = 'dashboard' | 'invoices' | 'create' | 'settings' | 'details';