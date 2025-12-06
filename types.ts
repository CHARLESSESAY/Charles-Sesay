
export enum LegalForm {
  PLC = 'Public Limited Company',
  LTD = 'Private Limited Company',
  PARTNERSHIP = 'Partnership',
  SOLE = 'Sole Proprietorship',
  NGO = 'Non-Governmental Organization',
  GOV = 'Public Authority / Local Gov'
}

export enum ReportStatus {
  MISSING = 'Missing',
  DRAFT = 'Draft',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string;
  previousHash: string;
  hash: string; // Blockchain simulation
  actor: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  category: string;
}

export interface AnnualReport {
  year: number;
  status: ReportStatus;
  submissionDate?: string;
  revenue?: number;
  transactionVolume?: number; // Proven transaction numbers
  notes?: string;
  filedBy?: string;
}

export interface Company {
  id: string;
  registryCode: string;
  name: string;
  legalForm: LegalForm;
  registrationDate: string;
  capital: number;
  address: string;
  website?: string; // New Website Field
  businessLogo?: string;
  status: 'Active' | 'Liquidated' | 'Bankruptcy' | 'Inactive';
  reports: AnnualReport[];
  history: AuditLog[];
  
  // New Enhanced Fields
  managementBoard: { name: string; position: string }[]; // Top Administrative Members
  contactEmail: string;
  contactPhone: string;
  beneficialOwners: string[];
  taxDebt: number; // Amount in SLE, 0 means clean. Managed by Admin.
  commercialPledges: number; // Number of active pledges
  relationships: { entity: string; type: 'Subsidiary' | 'Parent' | 'Partner' | 'Shareholder' }[];
  ownershipGraphUrl?: string; // Admin added photo of ownership graph
  
  // Business Portal Features
  transactions: Transaction[];
  isWebsitePublished: boolean;
}

export type ViewState = 'SEARCH' | 'COMPANY_DETAIL' | 'ADMIN_DASHBOARD' | 'USER_DASHBOARD' | 'NAME_CHECK' | 'OPEN_DATA' | 'DUE_DILIGENCE' | 'GENERATED_WEBSITE';
