import { Invoice, InvoiceStatus } from './types';

export const MOCK_CUSTOMERS = [
  { id: 'c1', name: 'Nile Coffee Exports Ltd', email: 'accounts@nilecoffee.ug', address: 'Plot 43 Jinja Road, Kampala, Uganda' },
  { id: 'c2', name: 'Pearl of Africa Tours', email: 'bookings@pearltours.co.ug', address: 'Entebbe Road, Entebbe, Uganda' },
  { id: 'c3', name: 'Crane Construction', email: 'finance@cranebuild.ug', address: 'Industrial Area, 6th Street, Kampala' },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv_001',
    number: 'INV-2024-001',
    date: '2024-05-01',
    dueDate: '2024-05-15',
    customer: MOCK_CUSTOMERS[0],
    items: [
      { description: 'Website Redesign', quantity: 1, unitPrice: 2500000, total: 2500000 },
      { description: 'Annual Hosting', quantity: 1, unitPrice: 350000, total: 350000 }
    ],
    subtotal: 2850000,
    tax: 513000, // 18% VAT
    total: 3363000,
    status: InvoiceStatus.PAID,
    currency: 'UGX'
  },
  {
    id: 'inv_002',
    number: 'INV-2024-002',
    date: '2024-05-10',
    dueDate: '2024-05-24',
    customer: MOCK_CUSTOMERS[1],
    items: [
      { description: 'SEO Consultation (Q2)', quantity: 1, unitPrice: 1500000, total: 1500000 }
    ],
    subtotal: 1500000,
    tax: 270000,
    total: 1770000,
    status: InvoiceStatus.PENDING,
    currency: 'UGX'
  },
  {
    id: 'inv_003',
    number: 'INV-2024-003',
    date: '2024-04-20',
    dueDate: '2024-05-04',
    customer: MOCK_CUSTOMERS[2],
    items: [
      { description: 'Project Management Software Setup', quantity: 1, unitPrice: 4000000, total: 4000000 }
    ],
    subtotal: 4000000,
    tax: 720000,
    total: 4720000,
    status: InvoiceStatus.OVERDUE,
    currency: 'UGX'
  },
  {
    id: 'inv_004',
    number: 'INV-2024-004',
    date: '2024-05-18',
    dueDate: '2024-06-01',
    customer: MOCK_CUSTOMERS[0],
    items: [
      { description: 'Urgent Server Maintenance', quantity: 3, unitPrice: 150000, total: 450000 }
    ],
    subtotal: 450000,
    tax: 81000,
    total: 531000,
    status: InvoiceStatus.PENDING,
    currency: 'UGX'
  }
];

export const REVENUE_DATA = [
  { name: 'Jan', revenue: 12500000 },
  { name: 'Feb', revenue: 9800000 },
  { name: 'Mar', revenue: 8200000 },
  { name: 'Apr', revenue: 10500000 },
  { name: 'May', revenue: 7100000 },
  { name: 'Jun', revenue: 9500000 },
];