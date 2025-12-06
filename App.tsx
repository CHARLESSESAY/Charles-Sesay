import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Company, LegalForm, ReportStatus, ViewState, AuditLog, AnnualReport, Transaction } from './types';
import { generateHash, formatCurrency, formatDate } from './utils';
import { SearchFilters } from './components/SearchFilters';
import { AIAssistant } from './components/AIAssistant';
import { EditCompanyDetails } from './components/EditCompanyDetails';
import { 
  Building2, 
  ShieldCheck, 
  ChevronRight, 
  FileText, 
  History, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  Search,
  Globe,
  Lock,
  User,
  LogOut,
  Briefcase,
  Download,
  ExternalLink,
  Users,
  AlertTriangle,
  Network,
  Database,
  Hand, 
  FileSpreadsheet,
  FileCode,
  Edit,
  Save,
  Clock,
  Settings,
  PenTool,
  Home,
  Plus,
  Image as ImageIcon,
  MapPin,
  Video,
  Calendar,
  Menu,
  MoreHorizontal,
  Activity,
  Server,
  FileCheck,
  Smartphone,
  Layout,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trash2,
  Loader2
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c_africell',
    registryCode: 'PV 4567',
    name: 'Africell Sierra Leone Ltd',
    legalForm: LegalForm.LTD,
    registrationDate: '2005-01-01',
    capital: 50000000,
    address: '1 Africell Road, Wilberforce, Freetown',
    website: 'www.africell.sl',
    businessLogo: 'https://placehold.co/200x200/d946ef/ffffff?text=Africell',
    status: 'Active',
    managementBoard: [{ name: 'Ziad Dalloul', position: 'Group CEO' }, { name: 'Shadi Gerjawi', position: 'Managing Director' }],
    contactEmail: 'info@africell.sl',
    contactPhone: '078875269', // Updated
    beneficialOwners: ['Lintel Capital', 'Africell Holding'],
    taxDebt: 0,
    commercialPledges: 5,
    relationships: [{ entity: 'Lintel Capital', type: 'Parent' }],
    ownershipGraphUrl: 'https://placehold.co/600x400/f0f9ff/1e3a8a?text=Africell+Structure+Graph',
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 450000000, transactionVolume: 150000, submissionDate: '2024-03-15', filedBy: 'Finance Director' }
    ],
    history: [
      { id: 'h_a1', timestamp: '2005-01-01T09:00:00Z', action: 'REGISTRATION', details: 'Initial Registration - Mobile Operator', previousHash: '0x00000...', hash: '0x8f2a1...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  },
  {
    id: 'c_airtel',
    registryCode: 'PV 8901',
    name: 'Airtel Sierra Leone Ltd',
    legalForm: LegalForm.LTD,
    registrationDate: '2004-06-15',
    capital: 45000000,
    address: '25 Main Motor Road, Freetown',
    website: 'www.airtel.sl',
    businessLogo: 'https://placehold.co/200x200/ef4444/ffffff?text=Airtel',
    status: 'Active',
    managementBoard: [{ name: 'Sunil Bharti', position: 'Chairman' }, { name: 'Local Director', position: 'Country Manager' }],
    contactEmail: 'support@airtel.sl',
    contactPhone: '+232 78 000 000',
    beneficialOwners: ['Bharti Airtel'],
    taxDebt: 0,
    commercialPledges: 3,
    relationships: [{ entity: 'Bharti Airtel', type: 'Parent' }],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 380000000, transactionVolume: 120000 }
    ],
    history: [
      { id: 'h_ai1', timestamp: '2004-06-15T10:00:00Z', action: 'REGISTRATION', details: 'Incorporation', previousHash: '0x00000...', hash: '0x3c4d5...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  },
  {
    id: 'c_slcb',
    registryCode: 'C.I. 123/1917',
    name: 'Sierra Leone Commercial Bank',
    legalForm: LegalForm.PLC,
    registrationDate: '1917-02-15',
    capital: 100000000,
    address: 'Siaka Stevens Street, Freetown',
    website: 'www.slcb.com',
    businessLogo: 'https://placehold.co/200x200/1e40af/ffffff?text=SLCB',
    status: 'Active',
    managementBoard: [{ name: 'Yusufu A. Silla', position: 'Managing Director' }, { name: 'Board Chair', position: 'Chairman' }],
    contactEmail: 'info@slcb.com',
    contactPhone: '+232 22 225 264',
    beneficialOwners: ['Government of Sierra Leone', 'NASSIT'],
    taxDebt: 0,
    commercialPledges: 0,
    relationships: [{ entity: 'Bank of Sierra Leone', type: 'Partner' }],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 85000000, transactionVolume: 500000 }
    ],
    history: [
       { id: 'h_slcb1', timestamp: '1917-02-15T09:00:00Z', action: 'REGISTRATION', details: 'Oldest Bank Registered', previousHash: '0x00000...', hash: '0x1a2b3...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  },
  {
    id: 'c_rokel',
    registryCode: 'PV 2345',
    name: 'Rokel Commercial Bank',
    legalForm: LegalForm.PLC,
    registrationDate: '2003-04-10',
    capital: 80000000,
    address: 'Siaka Stevens Street, Freetown',
    website: 'www.rokelbank.sl',
    businessLogo: 'https://placehold.co/200x200/000000/ffffff?text=RCBank',
    status: 'Active',
    managementBoard: [{ name: 'Dr. Walton Gilpin', position: 'Managing Director' }],
    contactEmail: 'info@rokelbank.sl',
    contactPhone: '+232 76 600 000',
    beneficialOwners: ['Government of Sierra Leone'],
    taxDebt: 0,
    commercialPledges: 1,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 75000000, transactionVolume: 450000 }
    ],
    history: [
       { id: 'h_rb1', timestamp: '2003-04-10T11:00:00Z', action: 'REGISTRATION', details: 'Rebranding & Registration', previousHash: '0x00000...', hash: '0x9a8b7...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  },
  {
    id: 'c_lantraco',
    registryCode: 'BN 5678',
    name: 'Lantraco Ltd',
    legalForm: LegalForm.LTD,
    registrationDate: '1995-08-12',
    capital: 5000000,
    address: 'Cline Town, Freetown',
    website: '',
    businessLogo: 'https://placehold.co/200x200/64748b/ffffff?text=Lantraco',
    status: 'Active',
    managementBoard: [{ name: 'Operations Director', position: 'Director of Logistics' }],
    contactEmail: 'ops@lantraco.sl',
    contactPhone: '+232 30 123 456',
    beneficialOwners: ['Private Shareholders'],
    taxDebt: 25000,
    commercialPledges: 2,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.SUBMITTED, revenue: 12000000, transactionVolume: 300 }
    ],
    history: [
       { id: 'h_lan1', timestamp: '1995-08-12T08:00:00Z', action: 'REGISTRATION', details: 'Logistics Company Registered', previousHash: '0x00000...', hash: '0x4d5e6...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: false
  },
  {
    id: 'c_rutile',
    registryCode: 'C.I. 456/1960',
    name: 'Sierra Rutile Ltd',
    legalForm: LegalForm.LTD,
    registrationDate: '1960-01-01',
    capital: 200000000,
    address: 'Moyamba District',
    website: 'www.sierra-rutile.com',
    businessLogo: 'https://placehold.co/200x200/ea580c/ffffff?text=Rutile',
    status: 'Active',
    managementBoard: [{ name: 'Theuns de Bruyn', position: 'CEO' }],
    contactEmail: 'info@sierra-rutile.com',
    contactPhone: '+232 79 999 999',
    beneficialOwners: ['Iluka Resources'],
    taxDebt: 0,
    commercialPledges: 10,
    relationships: [{ entity: 'Iluka Resources', type: 'Parent' }],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 950000000, transactionVolume: 500 }
    ],
    history: [
       { id: 'h_rut1', timestamp: '1960-01-01T09:00:00Z', action: 'REGISTRATION', details: 'Titanium Mining Incorporation', previousHash: '0x00000...', hash: '0x7f8e9...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  },
  {
    id: 'c_london',
    registryCode: 'PV 7890',
    name: 'London Mining Co. SL',
    legalForm: LegalForm.LTD,
    registrationDate: '2005-01-01',
    capital: 10000000,
    address: 'Lunsar, Port Loko District',
    website: '',
    businessLogo: 'https://placehold.co/200x200/94a3b8/ffffff?text=LMC',
    status: 'Liquidated',
    managementBoard: [{ name: 'Liquidator', position: 'Appointed Admin' }],
    contactEmail: 'contact@londonmining.sl',
    contactPhone: '+232 00 000 000',
    beneficialOwners: ['Creditors'],
    taxDebt: 500000,
    commercialPledges: 0,
    relationships: [],
    reports: [
      { year: 2014, status: ReportStatus.APPROVED, revenue: 5000000, transactionVolume: 100 }
    ],
    history: [
       { id: 'h_lon2', timestamp: '2015-02-20T14:00:00Z', action: 'LIQUIDATION', details: 'Company entered liquidation', previousHash: '0x11111...', hash: '0x22222...', actor: 'Court Order' },
       { id: 'h_lon1', timestamp: '2005-01-01T09:00:00Z', action: 'REGISTRATION', details: 'Iron Ore Mining Registration', previousHash: '0x00000...', hash: '0x11111...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: false
  },
  {
    id: 'c_nic',
    registryCode: 'C.I. 234/1976',
    name: 'National Insurance Co. Ltd',
    legalForm: LegalForm.GOV,
    registrationDate: '1976-05-20',
    capital: 25000000,
    address: 'Walpole Street, Freetown',
    website: 'www.nic.sl',
    businessLogo: 'https://placehold.co/200x200/16a34a/ffffff?text=NIC',
    status: 'Active',
    managementBoard: [{ name: 'Managing Director', position: 'MD' }, { name: 'Board Chair', position: 'Chairperson' }],
    contactEmail: 'info@nic.sl',
    contactPhone: '+232 22 222 000',
    beneficialOwners: ['Government of Sierra Leone'],
    taxDebt: 0,
    commercialPledges: 0,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 35000000, transactionVolume: 25000 }
    ],
    history: [
       { id: 'h_nic1', timestamp: '1976-05-20T10:00:00Z', action: 'REGISTRATION', details: 'State-owned Insurer Registered', previousHash: '0x00000...', hash: '0x5a6b7...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  },
  {
    id: 'c_fcsc',
    registryCode: 'BN 3456',
    name: 'Freetown Cold Storage Co.',
    legalForm: LegalForm.LTD,
    registrationDate: '1980-03-15',
    capital: 15000000,
    address: 'Wellington Industrial Estate, Freetown',
    website: '',
    businessLogo: 'https://placehold.co/200x200/3b82f6/ffffff?text=FCSC',
    status: 'Active',
    managementBoard: [{ name: 'Ops Manager', position: 'Operations' }],
    contactEmail: 'sales@fcsc.sl',
    contactPhone: '+232 30 999 888',
    beneficialOwners: ['Private Holdings'],
    taxDebt: 0,
    commercialPledges: 1,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 22000000, transactionVolume: 8000 }
    ],
    history: [
       { id: 'h_fc1', timestamp: '1980-03-15T09:00:00Z', action: 'REGISTRATION', details: 'Fisheries & Storage Registration', previousHash: '0x00000...', hash: '0x9c8d7...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: false
  },
  {
    id: 'c_tejan',
    registryCode: 'PV 0123',
    name: 'Tejan Enterprises',
    legalForm: LegalForm.SOLE,
    registrationDate: '2010-11-05',
    capital: 1000000,
    address: 'East End, Freetown',
    website: '',
    businessLogo: 'https://placehold.co/200x200/f59e0b/ffffff?text=Tejan',
    status: 'Active',
    managementBoard: [{ name: 'Tejan Kamara', position: 'Owner' }],
    contactEmail: 'tejan@enterprises.sl',
    contactPhone: '+232 77 123 123',
    beneficialOwners: ['Tejan Kamara'],
    taxDebt: 1500,
    commercialPledges: 0,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.MISSING }
    ],
    history: [
       { id: 'h_tej1', timestamp: '2010-11-05T14:30:00Z', action: 'REGISTRATION', details: 'General Merchandise Trader', previousHash: '0x00000...', hash: '0x3f4e5...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: false
  }
];

type Tab = 'GENERAL' | 'REPORTS' | 'GOVERNANCE' | 'HISTORY' | 'VISUALIZER';
type ExtendedViewState = ViewState | 'PORTAL_LOGIN' | 'PORTAL_DASHBOARD' | 'PORTAL_FILE_REPORT' | 'PORTAL_EDIT_DETAILS' | 'NAME_CHECK' | 'OPEN_DATA' | 'DUE_DILIGENCE' | 'GENERATED_WEBSITE';
type LangCode = 'en' | 'zh' | 'fr' | 'es' | 'hi' | 'ru';

const NEW_COMPANY_ID = 'NEW_ENTRY';
const EMPTY_COMPANY: Company = {
  id: NEW_COMPANY_ID,
  registryCode: '',
  name: '',
  legalForm: LegalForm.LTD,
  registrationDate: new Date().toISOString().split('T')[0],
  capital: 0,
  address: '',
  website: '',
  businessLogo: '',
  status: 'Active',
  reports: [],
  history: [],
  managementBoard: [],
  contactEmail: '',
  contactPhone: '',
  beneficialOwners: [],
  taxDebt: 0,
  commercialPledges: 0,
  relationships: [],
  transactions: [],
  isWebsitePublished: false
};

// --- TRANSLATIONS & DICTIONARY ---

const TRANSLATIONS = {
  en: {
    directoryTitle: 'SL Business Directory',
    searchPlaceholder: 'Search by company name or registry code...',
    checkName: 'Check Name Availability',
    login: 'Login',
    myPortal: 'My Portal',
    dashboard: 'Dashboard',
    search: 'Directory Search',
    openData: 'Open Data / Bulk',
    langName: 'English',
    pendingReports: 'Pending Reports',
    approvedReports: 'Approved Reports',
    fileReport: 'File Annual Report',
    editProfile: 'Edit Profile',
    status: 'Status',
    revenue: 'Revenue (SLE)',
    txVolume: 'Tx Volume',
    actions: 'Actions',
    approve: 'Approve',
    reject: 'Reject',
    businessLogin: 'Business Login',
    registryCode: 'Registry Code / Business ID',
    home: 'Home',
    legalForm: 'Legal Form',
    registered: 'Registered',
    capital: 'Capital',
    viewDetails: 'View Details',
    details: 'Details',
    address: 'Address',
    topMembers: 'Top Runners',
    contact: 'Contact',
    email: 'Email',
    phone: 'Phone (Secured)',
    beneficialOwners: 'Beneficial Owners',
    commercialPledges: 'Commercial Pledges',
    taxStatus: 'Tax Status',
    goodStanding: 'Good Standing',
    taxDebt: 'Tax Debt Found',
    year: 'Year',
    filedBy: 'Filed By',
    visualizer: 'Visualizer',
    generalInfo: 'General Info',
    governance: 'Governance & Risk',
    history: 'History',
    reports: 'Reports'
  },
  zh: { directoryTitle: '塞拉利昂商业目录', searchPlaceholder: '搜索...', checkName: '检查名称', login: '登录', myPortal: '我的门户', dashboard: '仪表板', search: '搜索', openData: '开放数据', langName: '中文', pendingReports: '待处理', approvedReports: '已批准', fileReport: '提交报告', editProfile: '编辑', status: '状态', revenue: '收入', txVolume: '交易量', actions: '操作', approve: '批准', reject: '拒绝', businessLogin: '企业登录', registryCode: '注册码', home: '首页', legalForm: '法律形式', registered: '注册', capital: '资本', viewDetails: '详情', details: '详情', address: '地址', topMembers: '成员', contact: '联系', email: '电邮', phone: '电话', beneficialOwners: '受益人', commercialPledges: '质押', taxStatus: '税务', goodStanding: '信誉', taxDebt: '债务', year: '年', filedBy: '提交人', visualizer: '图表', generalInfo: '信息', governance: '治理', history: '历史', reports: '报告' },
  fr: { directoryTitle: 'Répertoire SL', searchPlaceholder: 'Recherche...', checkName: 'Vérifier', login: 'Connexion', myPortal: 'Portail', dashboard: 'Tableau', search: 'Rechercher', openData: 'Données', langName: 'Français', pendingReports: 'En attente', approvedReports: 'Approuvé', fileReport: 'Déposer', editProfile: 'Modifier', status: 'Statut', revenue: 'Revenu', txVolume: 'Volume', actions: 'Actions', approve: 'Approuver', reject: 'Rejeter', businessLogin: 'Entreprise', registryCode: 'Code', home: 'Accueil', legalForm: 'Forme', registered: 'Enregistré', capital: 'Capital', viewDetails: 'Détails', details: 'Détails', address: 'Adresse', topMembers: 'Membres', contact: 'Contact', email: 'Email', phone: 'Tél', beneficialOwners: 'Bénéficiaires', commercialPledges: 'Gages', taxStatus: 'Fiscalité', goodStanding: 'En règle', taxDebt: 'Dette', year: 'Année', filedBy: 'Par', visualizer: 'Visuel', generalInfo: 'Infos', governance: 'Gouv', history: 'Hist', reports: 'Rapports' },
  es: { directoryTitle: 'Directorio SL', searchPlaceholder: 'Buscar...', checkName: 'Verificar', login: 'Acceso', myPortal: 'Portal', dashboard: 'Tablero', search: 'Buscar', openData: 'Datos', langName: 'Español', pendingReports: 'Pendiente', approvedReports: 'Aprobado', fileReport: 'Presentar', editProfile: 'Editar', status: 'Estado', revenue: 'Ingresos', txVolume: 'Volumen', actions: 'Acciones', approve: 'Aprobar', reject: 'Rechazar', businessLogin: 'Negocio', registryCode: 'Código', home: 'Inicio', legalForm: 'Forma', registered: 'Registrado', capital: 'Capital', viewDetails: 'Detalles', details: 'Detalles', address: 'Dirección', topMembers: 'Miembros', contact: 'Contacto', email: 'Email', phone: 'Tel', beneficialOwners: 'Dueños', commercialPledges: 'Prendas', taxStatus: 'Impuestos', goodStanding: 'Bien', taxDebt: 'Deuda', year: 'Año', filedBy: 'Por', visualizer: 'Visual', generalInfo: 'Info', governance: 'Gob', history: 'Hist', reports: 'Informes' },
  hi: { directoryTitle: 'SL निर्देशिका', searchPlaceholder: 'खोजें...', checkName: 'जांचें', login: 'लॉग इन', myPortal: 'पोर्टल', dashboard: 'डैशबोर्ड', search: 'खोज', openData: 'डेटा', langName: 'हिन्दी', pendingReports: 'लंबित', approvedReports: 'स्वीकृत', fileReport: 'फाइल', editProfile: 'संपादित', status: 'स्थिति', revenue: 'राजस्व', txVolume: 'मात्रा', actions: 'क्रिया', approve: 'मंजूर', reject: 'रद्द', businessLogin: 'व्यापार', registryCode: 'कोड', home: 'घर', legalForm: 'रूप', registered: 'पंजीकृत', capital: 'पूंजी', viewDetails: 'विवरण', details: 'विवरण', address: 'पता', topMembers: 'सदस्य', contact: 'संपर्क', email: 'ईमेल', phone: 'फोन', beneficialOwners: 'मालिक', commercialPledges: 'गिरवी', taxStatus: 'कर', goodStanding: 'अच्छा', taxDebt: 'ऋण', year: 'वर्ष', filedBy: 'द्वारा', visualizer: 'दृश्य', generalInfo: 'सामान्य', governance: 'शासन', history: 'इतिहास', reports: 'रिपोर्ट' },
  ru: { directoryTitle: 'Справочник SL', searchPlaceholder: 'Поиск...', checkName: 'Проверка', login: 'Вход', myPortal: 'Портал', dashboard: 'Панель', search: 'Поиск', openData: 'Данные', langName: 'Русский', pendingReports: 'Ожидание', approvedReports: 'Одобрено', fileReport: 'Подать', editProfile: 'Ред.', status: 'Статус', revenue: 'Доход', txVolume: 'Объем', actions: 'Действия', approve: 'Одобрить', reject: 'Нет', businessLogin: 'Бизнес', registryCode: 'Код', home: 'Дом', legalForm: 'Форма', registered: 'Рег.', capital: 'Капитал', viewDetails: 'Инфо', details: 'Детали', address: 'Адрес', topMembers: 'Члены', contact: 'Контакт', email: 'Email', phone: 'Тел', beneficialOwners: 'Владельцы', commercialPledges: 'Залоги', taxStatus: 'Налоги', goodStanding: 'Норм', taxDebt: 'Долг', year: 'Год', filedBy: 'Кем', visualizer: 'Схема', generalInfo: 'Инфо', governance: 'Упр.', history: 'История', reports: 'Отчеты' }
};

const DATA_DICTIONARY: Record<string, Record<string, string>> = {
  'Active': { zh: '活跃', fr: 'Actif', es: 'Activo', hi: 'सक्रिय', ru: 'Активный' },
};

// --- ACCESSIBILITY COMPONENT ---

const SignLanguageInterpreter: React.FC<{ isActive: boolean, isSigning: boolean, hoverText: string }> = ({ isActive, isSigning, hoverText }) => {
  if (!isActive) return null;

  const getSignImage = (char: string) => {
    const c = char.toLowerCase();
    if (c >= 'a' && c <= 'z') return `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${c.toUpperCase()}.svg`;
    if (c >= '0' && c <= '9') return `https://commons.wikimedia.org/wiki/Special:FilePath/Sign_language_${c}.svg`;
    return null;
  };

  const renderSignSentence = (text: string) => {
    if (!text) return <span className="text-blue-100/50 text-xs italic font-medium tracking-wide">Hover over text to translate...</span>;

    const chars = text.split('');
    return (
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide px-1">
        {chars.map((char, i) => {
          const src = getSignImage(char);
          if (char === ' ') return <div key={i} className="w-3 flex-shrink-0" />;
          if (src) {
            return (
              <div key={i} className="flex flex-col items-center flex-shrink-0 group">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-1 shadow-sm border border-blue-200 group-hover:scale-110 transition-transform">
                   <img src={src} alt={`Sign for ${char}`} className="w-full h-full object-contain" />
                </div>
                <span className="text-[9px] text-blue-100 font-bold uppercase mt-1 font-mono">{char}</span>
              </div>
            );
          }
          return <span key={i} className="text-xs text-blue-100 font-mono w-4 text-center flex-shrink-0 font-bold">{char}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="fixed bottom-24 left-6 z-50 animate-fade-in-up">
        <div className="bg-blue-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border border-blue-600/50 w-80 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-3 border-b border-blue-700 pb-2">
                <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4 text-blue-300" />
                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">ASL Interpreter</span>
                </div>
                <div className={`h-2 w-2 rounded-full shadow-[0_0_10px_currentColor] ${isSigning || hoverText ? 'bg-green-400 text-green-400 animate-pulse' : 'bg-red-500 text-red-500'}`}></div>
            </div>
            {/* Interpreter View */}
            <div className="h-28 bg-gradient-to-br from-slate-900 to-blue-950 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden border border-blue-700/50 shadow-inner group">
                <div className={`relative transition-all duration-500 flex items-center justify-center ${isSigning || hoverText ? 'scale-100' : 'scale-90 opacity-60'}`}>
                   <User className={`w-14 h-14 text-blue-300/20 transition-all duration-300 ${isSigning || hoverText ? 'text-blue-300 drop-shadow-[0_0_15px_rgba(147,197,253,0.5)]' : ''}`} />
                    {(isSigning || hoverText) && (
                        <>
                            <div className="absolute top-5 -left-6 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-[ping_1s_infinite]"></div>
                            <div className="absolute top-5 -right-6 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-[ping_1s_infinite_0.3s]"></div>
                        </>
                    )}
                </div>
                <div className="absolute top-2 right-2 bg-black/40 px-1.5 py-0.5 rounded text-[9px] font-bold text-blue-300 flex items-center gap-1 border border-blue-500/20">
                    <Video className="w-2.5 h-2.5" /> LIVE
                </div>
            </div>
            
            {/* Sign Symbol Stream */}
            <div className="min-h-[70px] bg-black/20 rounded-xl p-2.5 border border-blue-800/30 flex flex-col justify-center shadow-inner">
                 {renderSignSentence(hoverText)}
            </div>
        </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ExtendedViewState>('SEARCH');
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('GENERAL');
  const [lang, setLang] = useState<LangCode>('en');
  
  // Accessibility State
  const [signLanguageMode, setSignLanguageMode] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [hoverText, setHoverText] = useState('');

  // Name Check State
  const [nameAvailability, setNameAvailability] = useState<'IDLE' | 'CHECKING' | 'AVAILABLE' | 'TAKEN'>('IDLE');
  const [nameCheckValue, setNameCheckValue] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState<{name: string, role: 'USER' | 'ADMIN' | 'BUSINESS', companyId?: string} | null>(null);
  const [loginTab, setLoginTab] = useState<'REGISTRAR' | 'BUSINESS'>('REGISTRAR');
  const [businessIdInput, setBusinessIdInput] = useState('');
  const [phoneNumberInput, setPhoneNumberInput] = useState('');
  
  // Registrar Credentials State
  const [registrarId, setRegistrarId] = useState('');
  const [registrarPassword, setRegistrarPassword] = useState('');

  // 2FA State
  const [loginStep, setLoginStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  const [otpInput, setOtpInput] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [mockSmsNotification, setMockSmsNotification] = useState<string | null>(null);

  // Reporting/Editing State
  const [reportingCompanyId, setReportingCompanyId] = useState<string | null>(null);
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);

  // Translation Helper for UI
  const t = (key: keyof typeof TRANSLATIONS.en) => TRANSLATIONS[lang][key] || key;

  // Translation Helper for Data (Content)
  const tData = (text: string | number | undefined) => {
    if (text === undefined) return '';
    if (typeof text === 'number') {
        const localeMap: Record<LangCode, string> = { en: 'en-SL', zh: 'zh-CN', fr: 'fr-FR', es: 'es-ES', hi: 'hi-IN', ru: 'ru-RU' };
        return new Intl.NumberFormat(localeMap[lang]).format(text);
    }
    if (lang === 'en') return text;
    // Simple fallback for dictionary lookups not in the snippet
    return text; 
  };

  const tCurrency = (amount: number) => {
    const localeMap: Record<LangCode, string> = { en: 'en-SL', zh: 'zh-CN', fr: 'fr-FR', es: 'es-ES', hi: 'hi-IN', ru: 'ru-RU' };
    return formatCurrency(amount, localeMap[lang]);
  };

  const tDate = (date: string) => {
    const localeMap: Record<LangCode, string> = { en: 'en-GB', zh: 'zh-CN', fr: 'fr-FR', es: 'es-ES', hi: 'hi-IN', ru: 'ru-RU' };
    return formatDate(date, localeMap[lang]);
  };

  const handleGlobalMouseOver = (e: React.MouseEvent) => {
    if (!signLanguageMode) return;
    const target = e.target as HTMLElement;
    if (target.innerText && target.innerText.length > 0) {
        const cleanText = target.innerText.split('\n')[0].trim();
        if (cleanText.length > 0 && cleanText.length < 80) {
            setHoverText(cleanText);
        }
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const termLower = searchTerm.toLowerCase();
      const matchesTerm = c.name.toLowerCase().includes(termLower) || c.registryCode.toLowerCase().includes(termLower);
      const matchesForm = selectedForm ? c.legalForm === selectedForm : true;
      const matchesDate = dateFrom ? new Date(c.registrationDate) >= new Date(dateFrom) : true;
      return matchesTerm && matchesForm && matchesDate;
    });
  }, [companies, searchTerm, selectedForm, dateFrom]);
  
  const selectedCompany = companies.find(c => c.id === selectedCompanyId);

  // Actions
  const handleViewCompany = (id: string) => { setSelectedCompanyId(id); setActiveTab('GENERAL'); setView('COMPANY_DETAIL'); };
  
  const handleRegistrarLogin = () => {
    if (registrarId === '61637582' && registrarPassword === 'Sesay_26') {
        setCurrentUser({ name: 'Registrar Admin', role: 'ADMIN' });
        setView('ADMIN_DASHBOARD');
        // Clear sensitive inputs
        setRegistrarId('');
        setRegistrarPassword('');
    } else {
        alert("Invalid Registrar Credentials");
    }
  };
  
  const handleBusinessCredentialCheck = () => {
      const company = companies.find(c => c.registryCode.toLowerCase() === businessIdInput.trim().toLowerCase());
      
      if (!company) {
          alert("Invalid Business Registry Code");
          return;
      }

      // Robust Phone Normalization
      const cleanInput = phoneNumberInput.replace(/\D/g, '');
      const cleanStored = company.contactPhone.replace(/\D/g, '');
      
      const inputSuffix = cleanInput.slice(-8); 
      const storedSuffix = cleanStored.slice(-8);

      if (inputSuffix === storedSuffix && inputSuffix.length >= 6) {
          // Simulate generating OTP
          const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
          setGeneratedOtp(newOtp);
          setLoginStep('OTP');
          
          // Show simulated SMS notification
          setMockSmsNotification(`New Message: Your SL Business Registry code is ${newOtp}`);
          setTimeout(() => setMockSmsNotification(null), 10000); // Clear after 10s

      } else {
          alert(`Phone number mismatch. Please enter the number registered with ${company.name}.\n(Hint: It ends with ...${company.contactPhone.slice(-4)})`);
      }
  };

  const handleBusinessOtpCheck = () => {
      if (otpInput === generatedOtp) {
          const company = companies.find(c => c.registryCode.toLowerCase() === businessIdInput.trim().toLowerCase());
          if (company) {
             setCurrentUser({ name: company.name, role: 'BUSINESS', companyId: company.id }); 
             setView('PORTAL_DASHBOARD');
             // Reset login state
             setLoginStep('CREDENTIALS');
             setOtpInput('');
             setGeneratedOtp(null);
             setMockSmsNotification(null);
          }
      } else {
          alert("Incorrect Access Code");
      }
  };

  const handleLogout = () => { 
      setCurrentUser(null); 
      setBusinessIdInput(''); 
      setPhoneNumberInput(''); 
      setRegistrarId(''); 
      setRegistrarPassword(''); 
      setView('SEARCH'); 
      setLoginStep('CREDENTIALS'); 
      setMockSmsNotification(null); 
  };
  
  const checkNameAvailability = (name: string) => { if (!name.trim()) { setNameAvailability('IDLE'); return; } setNameAvailability('CHECKING'); setTimeout(() => { const taken = companies.some(c => c.name.toLowerCase() === name.toLowerCase()); setNameAvailability(taken ? 'TAKEN' : 'AVAILABLE'); }, 800); };
  const handleDueDiligence = (id: string) => { setSelectedCompanyId(id); setView('DUE_DILIGENCE'); };

  // Data Mutators
  const addAuditLog = (companyId: string, action: string, details: string, actor: string) => {
    setCompanies(prev => prev.map(c => {
      if (c.id !== companyId) return c;
      const lastHash = c.history[0]?.hash || '0x00000000';
      const timestamp = new Date().toISOString();
      const newLog: AuditLog = { id: Math.random().toString(36).substr(2, 9), timestamp, action, details, previousHash: lastHash, hash: generateHash(`${timestamp}-${action}`), actor };
      return { ...c, history: [newLog, ...c.history] };
    }));
  };

  const handleUserSubmitReport = (companyId: string, year: number, revenue: number, txVolume: number, publishWebsite: boolean) => {
    setCompanies(prev => prev.map(c => {
        if (c.id !== companyId) return c;
        const newReport: AnnualReport = { year, status: ReportStatus.SUBMITTED, revenue, transactionVolume: txVolume, submissionDate: new Date().toISOString().split('T')[0], filedBy: currentUser?.name || 'User' };
        return { 
            ...c, 
            reports: [newReport, ...c.reports.filter(r => r.year !== year)],
            isWebsitePublished: publishWebsite ? true : c.isWebsitePublished 
        };
    }));
    addAuditLog(companyId, 'REPORT_SUBMITTED', `Report ${year} Submitted ${publishWebsite ? '& Website Updated' : ''}`, currentUser?.name || 'User');
    setView('PORTAL_DASHBOARD');
  };

  const handleAddTransaction = (companyId: string, desc: string, amount: number, type: 'CREDIT' | 'DEBIT') => {
      setCompanies(prev => prev.map(c => {
          if (c.id !== companyId) return c;
          const newTx: Transaction = {
              id: `tx${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              description: desc,
              amount: amount,
              type: type,
              category: 'General'
          };
          return { ...c, transactions: [newTx, ...c.transactions] };
      }));
  };

  const handleAdminReviewReport = (companyId: string, year: number, approved: boolean) => {
    setCompanies(prev => prev.map(c => {
        if (c.id !== companyId) return c;
        const updatedReports = c.reports.map(r => r.year === year ? { ...r, status: approved ? ReportStatus.APPROVED : ReportStatus.REJECTED } : r);
        return { ...c, reports: updatedReports };
    }));
    addAuditLog(companyId, approved ? 'REPORT_APPROVED' : 'REPORT_REJECTED', `Report ${year} ${approved ? 'Approved' : 'Rejected'}`, 'Admin');
  };

  const handleUpdateCompanyDetails = (companyId: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => (c.id === companyId ? { ...c, ...updates } : c)));
    addAuditLog(companyId, 'UPDATE_DETAILS', `Fields Updated`, currentUser?.name || 'Admin');
    if (currentUser?.role === 'BUSINESS') setView('PORTAL_DASHBOARD'); else setEditingCompanyId(null);
  };

  const handleCreateCompany = (updates: Partial<Company>) => {
      const newId = `c_${Date.now()}`;
      const newCompany: Company = {
          ...EMPTY_COMPANY,
          ...updates,
          id: newId,
          // ensure arrays are initialized if not provided
          managementBoard: updates.managementBoard || [],
          reports: [],
          history: [],
          transactions: [],
      };
      setCompanies(prev => [newCompany, ...prev]);
      addAuditLog(newId, 'REGISTRATION', 'Initial Registration', currentUser?.name || 'Registrar');
      alert("Entity successfully registered!");
      setEditingCompanyId(null);
      setView('ADMIN_DASHBOARD');
  };

  const handleRegistrarAddEntry = (name: string, form: LegalForm, regCode: string) => {
      const newCompany: Company = { id: `c${Date.now()}`, registryCode: regCode, name, legalForm: form, registrationDate: new Date().toISOString().split('T')[0], capital: 0, address: 'Pending', businessLogo: '', website: '', status: 'Active', managementBoard: [], contactEmail: '', contactPhone: '', beneficialOwners: [], taxDebt: 0, commercialPledges: 0, relationships: [], reports: [], history: [], transactions: [], isWebsitePublished: false };
      setCompanies([newCompany, ...companies]);
      alert("Entity Added to Registry");
  };

  const handleStatusChange = (companyId: string, newStatus: string) => {
    setCompanies(prev => prev.map(c => c.id === companyId ? { ...c, status: newStatus as any } : c));
    addAuditLog(companyId, 'STATUS_CHANGE', `Status changed to ${newStatus}`, 'Registrar');
  };

  const downloadData = (format: string) => {
    // Mock download logic
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(companies));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "registry_data." + format.toLowerCase());
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    alert(`Downloading Bulk Data in ${format} format...`);
  };

  // --- RENDERERS ---

  const renderNavbar = () => (
    <nav className="bg-blue-900 text-white border-b border-blue-800 sticky top-0 z-40 shadow-xl transition-all h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer gap-4 group" onClick={() => setView('SEARCH')}>
            <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 group-hover:bg-white/20 transition-all">
              <ShieldCheck className="h-7 w-7 text-blue-300" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-serif font-bold tracking-tight leading-none text-white">{t('directoryTitle')}</h1>
              <div className="flex items-center gap-2 mt-1">
                 <div className="h-0.5 w-4 bg-blue-400 rounded-full"></div>
                 <p className="text-[10px] text-blue-300 font-bold tracking-widest uppercase">Official Registry</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => setView('SEARCH')} className="p-2.5 rounded-full text-blue-300 hover:text-white hover:bg-white/10 transition-all" title={t('home')}>
                <Home className="w-5 h-5" />
             </button>
             <button onClick={() => setSignLanguageMode(!signLanguageMode)} className={`p-2.5 rounded-full transition-all duration-300 ${signLanguageMode ? 'bg-white text-blue-900' : 'text-blue-300 hover:text-white hover:bg-white/10'}`}>
                <Hand className="w-5 h-5" />
             </button>
            <div className="hidden md:flex items-center bg-black/20 p-1.5 rounded-xl mr-2 gap-1 border border-white/5">
                {(['en', 'zh', 'fr', 'es', 'hi', 'ru'] as LangCode[]).map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all ${lang === l ? 'bg-blue-600 shadow text-white' : 'text-blue-400 hover:text-white'}`}>
                        {l.toUpperCase()}
                    </button>
                ))}
            </div>
            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block"></div>
            {currentUser ? (
                <div className="flex items-center gap-4">
                    <a href="https://nib.gov.sl" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-white">
                        <ExternalLink className="w-4 h-4" /> NIB Link
                    </a>
                    <span className="text-sm font-semibold text-blue-100 hidden sm:block">Hi, {currentUser.name}</span>
                    <button onClick={() => currentUser.role === 'ADMIN' ? setView('ADMIN_DASHBOARD') : setView('PORTAL_DASHBOARD')} className={`px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 border border-blue-500`}>
                        {t('dashboard')}
                    </button>
                    <button onClick={handleLogout} className="text-blue-300 hover:text-red-400 p-2"><LogOut className="w-5 h-5" /></button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <a href="https://nib.gov.sl" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-blue-200 hover:text-white px-2 py-2 font-bold text-sm">
                        <ExternalLink className="w-4 h-4" /> NIB Link
                    </a>
                    <button onClick={() => setView('PORTAL_LOGIN')} className="text-blue-200 hover:text-white px-4 py-2 font-bold text-sm flex items-center gap-2">
                        <Lock className="w-4 h-4" /> {t('login')}
                    </button>
                    <button onClick={() => setView('NAME_CHECK')} className="bg-white text-blue-900 px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2">
                        <Search className="w-4 h-4" /> {t('checkName')}
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );

  const renderSearch = () => (
    <div className="bg-slate-50 min-h-[calc(100vh-80px)]">
      {/* Decreased height of blue section */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 drop-shadow-lg">
            Sierra Leone <br/> <span className="text-blue-300">Business Registry</span>
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8 font-light">
            Verify entities, access annual reports, and conduct due diligence with blockchain-backed security.
          </p>
          <div className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-2">
             <div className="flex-grow relative">
                <Search className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder={t('searchPlaceholder')} className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 focus:outline-none text-lg" />
             </div>
             <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg">
               {t('search')}
             </button>
          </div>
          <div className="mt-6 flex justify-center">
            <button onClick={() => setShowFilters(!showFilters)} className="text-blue-300 hover:text-white text-sm font-medium flex items-center gap-2 border-b border-dashed border-blue-400 pb-0.5">
              Advanced Filters <ChevronRight className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 pb-20">
        {showFilters && <SearchFilters searchTerm={searchTerm} setSearchTerm={setSearchTerm} selectedForm={selectedForm} setSelectedForm={setSelectedForm} dateFrom={dateFrom} setDateFrom={setDateFrom} />}
        <div className="mt-12">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-2xl font-serif font-bold text-slate-800">Registered Entities</h3>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-slate-500 border border-slate-200">{filteredCompanies.length} Records</span>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredCompanies.map((company) => (
              <div key={company.id} onClick={() => handleViewCompany(company.id)} className="bg-white rounded-xl shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer p-6 flex flex-col md:flex-row items-center gap-6 group relative">
                   <div className="h-16 w-16 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-900 group-hover:scale-105 transition-transform">
                      {company.businessLogo ? <img src={company.businessLogo} className="h-full w-full object-cover rounded-xl" /> : <Building2 className="w-8 h-8" />}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{tData(company.name)}</h4>
                      <div className="flex gap-2 text-sm text-slate-500 mt-1">
                         <span className="font-mono bg-slate-100 px-2 rounded text-xs py-0.5">{company.registryCode}</span>
                         <span>•</span>
                         <span>{tData(company.legalForm)}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-4">
                      {company.isWebsitePublished && (
                          <button onClick={(e) => { e.stopPropagation(); setSelectedCompanyId(company.id); setView('GENERATED_WEBSITE'); }} className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors z-10">
                              <Globe className="w-3 h-3" /> Visit Site
                          </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDueDiligence(company.id); }} className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors z-10">
                          <Briefcase className="w-3 h-3" /> Due Diligence
                      </button>
                      <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-slate-400 uppercase">{t('status')}</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${company.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tData(company.status)}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500" />
                   </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDueDiligence = () => {
      if (!selectedCompany) return null;
      
      const riskScore = selectedCompany.taxDebt > 0 ? 65 : selectedCompany.reports.some(r => r.status === ReportStatus.MISSING) ? 80 : 98;
      const riskColor = riskScore > 90 ? 'text-green-500' : riskScore > 70 ? 'text-yellow-500' : 'text-red-500';

      return (
          <div className="max-w-4xl mx-auto px-4 py-10">
              <button onClick={() => setView('SEARCH')} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-700 mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Search</button>
              
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                  <div className="bg-blue-900 p-8 text-white flex justify-between items-start">
                      <div>
                          <div className="flex items-center gap-2 text-blue-300 mb-2">
                              <Briefcase className="w-4 h-4" />
                              <span className="text-xs font-bold uppercase tracking-widest">Official Due Diligence Report</span>
                          </div>
                          <h1 className="text-3xl font-serif font-bold">{selectedCompany.name}</h1>
                          <p className="opacity-80 mt-1 font-mono">{selectedCompany.registryCode}</p>
                      </div>
                      <div className="text-right">
                          <div className="text-xs font-bold opacity-60 uppercase">Compliance Score</div>
                          <div className={`text-4xl font-bold ${riskColor}`}>{riskScore}/100</div>
                      </div>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><FileCheck className="w-5 h-5 text-blue-600" /> Registry Verification</h3>
                              <ul className="space-y-3 text-sm">
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Legal Status</span>
                                      <span className={`font-bold ${selectedCompany.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>{selectedCompany.status}</span>
                                  </li>
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Registration Date</span>
                                      <span className="font-bold text-slate-900">{selectedCompany.registrationDate}</span>
                                  </li>
                                  <li className="flex justify-between">
                                      <span className="text-slate-500">Tax Good Standing</span>
                                      <span className={`font-bold ${selectedCompany.taxDebt === 0 ? 'text-green-600' : 'text-red-600'}`}>{selectedCompany.taxDebt === 0 ? 'Verified' : 'Outstanding Debt'}</span>
                                  </li>
                              </ul>
                          </div>

                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /> Beneficial Ownership</h3>
                              <div className="flex flex-wrap gap-2">
                                  {selectedCompany.beneficialOwners.map((owner, i) => (
                                      <span key={i} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">{owner}</span>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Network className="w-5 h-5 text-blue-600" /> Blockchain Evidence</h3>
                              <div className="space-y-3">
                                  {selectedCompany.history.slice(0, 3).map((log) => (
                                      <div key={log.id} className="text-xs bg-white p-2 rounded border border-slate-200">
                                          <div className="flex justify-between mb-1">
                                              <span className="font-bold text-slate-700">{log.action}</span>
                                              <span className="text-slate-400">{log.timestamp.split('T')[0]}</span>
                                          </div>
                                          <div className="font-mono text-slate-400 truncate">{log.hash}</div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                           <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95">
                                <Download className="w-5 h-5" /> Download Certified PDF
                           </button>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderCompanyDetail = () => {
    if (!selectedCompany) return null;
    
    // Authorization Check for Contact Info
    const isAuthorized = currentUser?.role === 'ADMIN' || (currentUser?.role === 'BUSINESS' && currentUser.companyId === selectedCompany.id);

    // Correctly map tab enums to translation keys
    const tabConfig: {id: Tab, label: string}[] = [
        { id: 'GENERAL', label: t('generalInfo') },
        { id: 'REPORTS', label: t('reports') },
        { id: 'GOVERNANCE', label: t('governance') },
        { id: 'HISTORY', label: t('history') },
        { id: 'VISUALIZER', label: t('visualizer') },
    ];

    return (
      <div className="bg-slate-50 min-h-[calc(100vh-80px)] pb-20">
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-20 z-30 pt-6">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <button onClick={() => setView('SEARCH')} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-700 mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> {t('directoryTitle')}</button>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6">
                 <div className="flex items-center gap-6">
                    <div className="bg-blue-50 h-20 w-20 rounded-xl flex items-center justify-center border border-blue-100">{selectedCompany.businessLogo ? <img src={selectedCompany.businessLogo} className="h-full w-full object-cover rounded-xl" /> : <Building2 className="w-10 h-10 text-blue-300" />}</div>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-slate-900">{tData(selectedCompany.name)}</h1>
                        <div className="flex gap-3 text-sm text-slate-600 mt-1">
                            <span className="font-mono">{selectedCompany.registryCode}</span>
                            <span className="text-slate-300">|</span>
                            <span>{tData(selectedCompany.legalForm)}</span>
                        </div>
                    </div>
                 </div>
                 <div className="flex gap-2">
                     <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg shadow-sm text-sm font-bold text-slate-700 hover:bg-slate-50"><Download className="w-4 h-4" /> Export</button>
                     <button onClick={() => handleDueDiligence(selectedCompany.id)} className="flex items-center gap-2 px-4 py-2 bg-blue-900 text-white rounded-lg shadow-md text-sm font-bold hover:bg-blue-800"><Briefcase className="w-4 h-4" /> Due Diligence</button>
                 </div>
              </div>
              <div className="flex space-x-6 overflow-x-auto scrollbar-hide border-t border-slate-100 pt-1">
                 {tabConfig.map((tab) => (
                     <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-800' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>{tab.label}</button>
                 ))}
              </div>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 min-h-[400px]">
                {activeTab === 'GENERAL' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-lg font-serif font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">{t('details')}</h3>
                            <dl className="space-y-6">
                                <div><dt className="text-xs font-bold text-slate-400 uppercase">{t('status')}</dt><dd className="mt-1"><span className={`inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ${selectedCompany.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{tData(selectedCompany.status)}</span></dd></div>
                                <div><dt className="text-xs font-bold text-slate-400 uppercase">{t('address')}</dt><dd className="mt-1 text-slate-800 flex gap-2"><MapPin className="w-4 h-4 text-slate-400" />{tData(selectedCompany.address)}</dd></div>
                            </dl>
                            
                            {/* Top Runners Section */}
                            <h3 className="text-lg font-serif font-bold text-slate-900 mt-8 mb-6 pb-2 border-b border-slate-100">{t('topMembers')}</h3>
                            <div className="space-y-4">
                                {selectedCompany.managementBoard.map((member, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 border border-slate-200 font-bold text-xs">{member.name.charAt(0)}</div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{member.name}</p>
                                            <p className="text-xs text-blue-600 font-medium">{member.position}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                             <h3 className="text-lg font-serif font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">{t('contact')}</h3>
                             <dl className="space-y-4">
                                <div><dt className="text-xs font-bold text-slate-400 uppercase">{t('email')}</dt><dd className="text-blue-600 font-medium">{selectedCompany.contactEmail}</dd></div>
                                <div>
                                    <dt className="text-xs font-bold text-slate-400 uppercase">{t('phone')}</dt>
                                    <dd className="text-slate-800 flex items-center gap-2 mt-1">
                                        {isAuthorized ? (
                                            <span className="font-bold">{selectedCompany.contactPhone}</span>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                                                <Lock className="w-3 h-3 text-slate-400" />
                                                <span className="font-mono text-xs text-slate-500">{generateHash(selectedCompany.contactPhone).substring(0, 20)}...</span>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider ml-2">(Protected)</span>
                                            </div>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                )}
                {activeTab === 'REPORTS' && (
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">{t('year')}</th><th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">{t('status')}</th></tr></thead>
                        <tbody className="divide-y divide-slate-200">{selectedCompany.reports.map(r => (<tr key={r.year}><td className="px-6 py-4 font-bold text-slate-900">{r.year}</td><td className="px-6 py-4"><span className="px-2 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-600">{tData(r.status)}</span></td></tr>))}</tbody>
                    </table>
                )}
                {activeTab === 'GOVERNANCE' && (
                     <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-serif font-bold text-slate-900 mb-4">{t('beneficialOwners')}</h3>
                            <div className="flex flex-wrap gap-2">{selectedCompany.beneficialOwners.map(o => <span key={o} className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg text-sm font-bold border border-blue-100">{o}</span>)}</div>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex gap-4 items-center">
                            {selectedCompany.taxDebt > 0 ? <AlertTriangle className="w-8 h-8 text-red-500" /> : <CheckCircle className="w-8 h-8 text-green-500" />}
                            <div>
                                <h4 className="font-bold text-slate-900">{selectedCompany.taxDebt > 0 ? t('taxDebt') : t('goodStanding')}</h4>
                                <p className="text-sm text-slate-500">{selectedCompany.taxDebt > 0 ? `Outstanding: ${tCurrency(selectedCompany.taxDebt)}` : 'No outstanding liabilities.'}</p>
                            </div>
                        </div>
                     </div>
                )}
                {activeTab === 'HISTORY' && (
                    <div className="space-y-6 border-l-2 border-slate-100 pl-6 relative">
                        {selectedCompany.history.map(h => (
                            <div key={h.id} className="relative">
                                <div className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-500 border-2 border-white shadow"></div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div className="flex justify-between mb-1"><span className="font-bold text-slate-900">{h.action}</span><span className="text-xs font-mono text-slate-400">{tDate(h.timestamp)}</span></div>
                                    <p className="text-sm text-slate-600">{h.details}</p>
                                    <div className="mt-2 text-[10px] font-mono text-slate-400 break-all bg-white p-1 rounded border border-slate-100">HASH: {h.hash}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === 'VISUALIZER' && (
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed min-h-[400px]">
                        {selectedCompany.ownershipGraphUrl ? (
                            <div className="w-full max-w-2xl mx-auto">
                                <h4 className="text-center text-sm font-bold text-slate-500 mb-4 uppercase tracking-widest">Corporate Structure Graph</h4>
                                <img src={selectedCompany.ownershipGraphUrl} alt="Ownership Graph" className="w-full h-auto rounded-lg shadow-lg border border-slate-200" />
                            </div>
                        ) : (
                            <div className="text-center">
                                <Network className="w-12 h-12 text-slate-300 mb-4 mx-auto" />
                                <p className="text-slate-500 font-bold">Ownership Graph Visualization</p>
                                <p className="text-slate-400 text-sm mt-2">No graphical structure data available for this entity.</p>
                            </div>
                        )}
                        
                        <div className="mt-8 flex gap-4">
                            <div className="p-4 bg-white shadow-sm rounded-lg border border-slate-200 text-center"><p className="text-xs text-slate-400 uppercase font-bold">Shareholders</p><p className="text-xl font-bold text-blue-900">{selectedCompany.beneficialOwners.length}</p></div>
                            <div className="p-4 bg-white shadow-sm rounded-lg border border-slate-200 text-center"><p className="text-xs text-slate-400 uppercase font-bold">Subsidiaries</p><p className="text-xl font-bold text-blue-900">{selectedCompany.relationships.filter(r => r.type === 'Subsidiary').length}</p></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-serif font-bold text-slate-800">Secure Access Portal</h2>
            <p className="text-slate-500 text-sm mt-2">Identity Verification Required</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
            <button onClick={() => { setLoginTab('REGISTRAR'); setLoginStep('CREDENTIALS'); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginTab === 'REGISTRAR' ? 'bg-white shadow text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}>Registrar</button>
            <button onClick={() => { setLoginTab('BUSINESS'); setLoginStep('CREDENTIALS'); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginTab === 'BUSINESS' ? 'bg-white shadow text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}>Business Entity</button>
        </div>

        {loginTab === 'REGISTRAR' && (
            <div className="space-y-4 animate-fade-in-up">
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Admin ID</label>
                    <input type="text" value={registrarId} onChange={(e) => setRegistrarId(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono" placeholder="ID" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Password</label>
                    <input type="password" value={registrarPassword} onChange={(e) => setRegistrarPassword(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="••••••••" />
                </div>
                <button onClick={handleRegistrarLogin} className="w-full bg-blue-900 text-white font-bold py-3 rounded-xl hover:bg-blue-800 transition-colors shadow-lg mt-2">Authenticate</button>
                <div className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-xs border border-yellow-200 mt-4">
                    <strong>Demo Credentials:</strong><br/>ID: 61637582<br/>Password: Sesay_26
                </div>
            </div>
        )}

        {loginTab === 'BUSINESS' && (
            <div className="space-y-4 animate-fade-in-up">
                {loginStep === 'CREDENTIALS' ? (
                    <>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Registry Code</label>
                            <input type="text" value={businessIdInput} onChange={(e) => setBusinessIdInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono" placeholder="e.g. PV 4567" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Registered Phone Number</label>
                            <input type="tel" value={phoneNumberInput} onChange={(e) => setPhoneNumberInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="+232..." />
                        </div>
                        <button onClick={handleBusinessCredentialCheck} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg mt-2">Send Access Code</button>
                    </>
                ) : (
                     <>
                        <div className="text-center mb-4">
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4 border border-blue-100">
                                Enter the 4-digit code sent to your phone ending in ...{phoneNumberInput.slice(-4)}
                            </div>
                            <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl font-mono tracking-widest" maxLength={4} placeholder="0000" />
                        </div>
                        <button onClick={handleBusinessOtpCheck} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">Verify & Login</button>
                        <button onClick={() => setLoginStep('CREDENTIALS')} className="w-full text-slate-400 text-xs font-bold py-2 hover:text-slate-600">Back to Credentials</button>
                    </>
                )}
            </div>
        )}
      </div>
      {/* Mock SMS Notification */}
      {mockSmsNotification && (
          <div className="fixed top-10 right-10 bg-black/90 text-white p-4 rounded-xl shadow-2xl z-[100] animate-bounce max-w-sm border border-slate-700 flex gap-3">
              <div className="bg-green-500 h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"><Smartphone className="w-6 h-6 text-white" /></div>
              <div>
                  <p className="font-bold text-sm">New SMS</p>
                  <p className="text-sm">{mockSmsNotification}</p>
              </div>
          </div>
      )}
    </div>
  );

  const renderAdminDashboard = () => (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[calc(100vh-80px)]">
          <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-serif font-bold text-slate-800">Registrar Dashboard</h2>
              <button onClick={() => { setEditingCompanyId(NEW_COMPANY_ID); setView('PORTAL_EDIT_DETAILS'); }} className="bg-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-800 flex items-center gap-2"><Plus className="w-5 h-5" /> Register New Entity</button>
          </div>

          {/* Pending Reports Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="bg-orange-50 border-b border-orange-100 p-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <h3 className="font-bold text-orange-900">Pending Annual Reports</h3>
              </div>
              <div className="p-0">
                  {companies.flatMap(c => c.reports.filter(r => r.status === ReportStatus.SUBMITTED).map(r => ({ ...r, companyName: c.name, companyId: c.id }))).length === 0 ? (
                      <div className="p-8 text-center text-slate-400 italic">No pending reports to review.</div>
                  ) : (
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                              <tr>
                                  <th className="px-6 py-3">Company</th>
                                  <th className="px-6 py-3">Year</th>
                                  <th className="px-6 py-3">Revenue Reported</th>
                                  <th className="px-6 py-3">Tx Volume</th>
                                  <th className="px-6 py-3">Actions</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {companies.flatMap(c => c.reports.filter(r => r.status === ReportStatus.SUBMITTED).map(r => ({ ...r, companyName: c.name, companyId: c.id }))).map((item, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50">
                                      <td className="px-6 py-4 font-bold text-slate-900">{item.companyName}</td>
                                      <td className="px-6 py-4">{item.year}</td>
                                      <td className="px-6 py-4 font-mono">{tCurrency(item.revenue || 0)}</td>
                                      <td className="px-6 py-4 font-mono">{item.transactionVolume}</td>
                                      <td className="px-6 py-4 flex gap-2">
                                          <button onClick={() => handleAdminReviewReport(item.companyId, item.year, true)} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-bold hover:bg-green-200 border border-green-200">Approve</button>
                                          <button onClick={() => handleAdminReviewReport(item.companyId, item.year, false)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg font-bold hover:bg-red-200 border border-red-200">Reject</button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  )}
              </div>
          </div>

          {/* Company Management */}
          <div className="grid grid-cols-1 gap-4">
              {companies.map(c => (
                  <div key={c.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 group hover:shadow-md transition-all">
                      <div className="flex items-center gap-4">
                           <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-lg">{c.name.charAt(0)}</div>
                           <div>
                               <h4 className="font-bold text-slate-900">{c.name}</h4>
                               <p className="text-xs text-slate-500 font-mono">{c.registryCode} • {c.legalForm}</p>
                           </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <select 
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border outline-none cursor-pointer ${c.status === 'Active' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}
                          >
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Liquidated">Liquidated</option>
                              <option value="Bankruptcy">Bankruptcy</option>
                          </select>
                          <button onClick={() => { setEditingCompanyId(c.id); setView('PORTAL_EDIT_DETAILS'); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit className="w-5 h-5" /></button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderPortalDashboard = () => {
    const company = companies.find(c => c.id === currentUser?.companyId);
    if (!company) return <div>Error: Company not found</div>;

    const currentYear = new Date().getFullYear();
    const lastReport = company.reports.find(r => r.year === currentYear - 1);
    const isReportPending = !lastReport || lastReport.status === ReportStatus.MISSING;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-slate-900">Welcome, {company.name}</h1>
                <p className="text-slate-500">Manage your business profile, filings, and compliance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><ShieldCheck className="w-24 h-24" /></div>
                    <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2">Compliance Status</p>
                    <h2 className="text-3xl font-bold mb-1">{company.status}</h2>
                    <p className="text-sm opacity-80">{company.taxDebt === 0 ? 'Good Standing' : 'Action Required'}</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group cursor-pointer hover:border-blue-300 transition-all" onClick={() => { setEditingCompanyId(company.id); setView('PORTAL_EDIT_DETAILS'); }}>
                    <div className="absolute top-4 right-4 bg-slate-100 p-2 rounded-lg text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"><Settings className="w-5 h-5" /></div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">Profile Management</p>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Edit Business Details</h3>
                    <p className="text-sm text-slate-500">Update contacts, address, site.</p>
                </div>

                <div className={`p-6 rounded-2xl shadow-sm border relative cursor-pointer transition-all ${isReportPending ? 'bg-orange-50 border-orange-200 hover:border-orange-300' : 'bg-green-50 border-green-200'}`} onClick={() => isReportPending && setView('PORTAL_FILE_REPORT')}>
                     <div className={`absolute top-4 right-4 p-2 rounded-lg ${isReportPending ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                         {isReportPending ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                     </div>
                     <p className={`${isReportPending ? 'text-orange-800' : 'text-green-800'} text-xs font-bold uppercase tracking-wider mb-3`}>Annual Filing</p>
                     <h3 className={`text-lg font-bold ${isReportPending ? 'text-orange-900' : 'text-green-900'} mb-1`}>{isReportPending ? `File ${currentYear - 1} Report` : 'Up to Date'}</h3>
                     <p className={`text-sm ${isReportPending ? 'text-orange-700' : 'text-green-700'}`}>{isReportPending ? 'Due immediately.' : 'No actions needed.'}</p>
                </div>
            </div>

            {/* Transaction Simulator for Demo */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-blue-600" /> Transaction Ledger Simulator</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <input id="txDesc" type="text" placeholder="Description (e.g. Sales Inv #102)" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    <input id="txAmount" type="number" placeholder="Amount (SLE)" className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" />
                    <button 
                        onClick={() => {
                            const desc = (document.getElementById('txDesc') as HTMLInputElement).value;
                            const amt = Number((document.getElementById('txAmount') as HTMLInputElement).value);
                            if (desc && amt) {
                                handleAddTransaction(company.id, desc, amt, 'CREDIT');
                                (document.getElementById('txDesc') as HTMLInputElement).value = '';
                                (document.getElementById('txAmount') as HTMLInputElement).value = '';
                            }
                        }}
                        className="bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                    >
                        Record Transaction
                    </button>
                </div>
                <div className="border rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                             {company.transactions.length === 0 ? (
                                 <tr><td colSpan={3} className="p-4 text-center text-slate-400 italic">No transactions recorded yet.</td></tr>
                             ) : (
                                 company.transactions.map((tx) => (
                                     <tr key={tx.id}>
                                         <td className="px-4 py-3 text-slate-500 font-mono text-xs">{tx.date}</td>
                                         <td className="px-4 py-3 font-medium text-slate-800">{tx.description}</td>
                                         <td className={`px-4 py-3 text-right font-mono font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-red-600'}`}>
                                             {tx.type === 'CREDIT' ? '+' : '-'}{tCurrency(tx.amount)}
                                         </td>
                                     </tr>
                                 ))
                             )}
                        </tbody>
                    </table>
                </div>
            </div>

            {company.isWebsitePublished && (
                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-purple-900 font-bold text-lg flex items-center gap-2"><Globe className="w-5 h-5" /> Live Business Site</h3>
                        <p className="text-purple-700 text-sm mt-1">Your auto-generated business website is active.</p>
                    </div>
                    <button onClick={() => { setSelectedCompanyId(company.id); setView('GENERATED_WEBSITE'); }} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-700 shadow-md">View Site</button>
                </div>
            )}
        </div>
    );
  };

  const renderNameCheckView = () => (
      <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-100 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2">Name Availability Check</h2>
              <p className="text-slate-500 mb-8">Ensure your proposed business name is unique before registration.</p>
              
              <div className="relative max-w-lg mx-auto mb-8">
                  <input 
                    type="text" 
                    value={nameCheckValue}
                    onChange={(e) => { setNameCheckValue(e.target.value); checkNameAvailability(e.target.value); }}
                    placeholder="Enter proposed name..." 
                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg font-bold text-slate-800 transition-colors"
                  />
                  <div className="absolute right-4 top-4">
                      {nameAvailability === 'CHECKING' && <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />}
                      {nameAvailability === 'AVAILABLE' && <CheckCircle className="w-6 h-6 text-green-500" />}
                      {nameAvailability === 'TAKEN' && <XCircle className="w-6 h-6 text-red-500" />}
                  </div>
              </div>

              {nameAvailability === 'AVAILABLE' && (
                  <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 animate-fade-in-up">
                      <p className="font-bold text-lg">"{nameCheckValue}" is available!</p>
                      <p className="text-sm opacity-80 mt-1">You can proceed to register this name.</p>
                  </div>
              )}
              
              {nameAvailability === 'TAKEN' && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 animate-fade-in-up">
                      <p className="font-bold text-lg">"{nameCheckValue}" is already taken.</p>
                      <p className="text-sm opacity-80 mt-1">Please try a variation or a different name.</p>
                  </div>
              )}

              <button onClick={() => setView('SEARCH')} className="mt-8 text-slate-400 hover:text-slate-600 text-sm font-bold">Back to Directory</button>
          </div>
      </div>
  );

  const renderOpenData = () => (
      <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Open Data Portal</h2>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">Access machine-readable data for research, analysis, and transparency. Updated daily via blockchain sync.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-blue-300 transition-all group">
                   <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform"><FileSpreadsheet className="w-7 h-7" /></div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">CSV / Excel Format</h3>
                   <p className="text-slate-500 mb-6 text-sm leading-relaxed">Complete registry dataset including legal status, registration dates, and capital info.</p>
                   <button onClick={() => downloadData('CSV')} className="w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">Download CSV</button>
               </div>

               <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:border-purple-300 transition-all group">
                   <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform"><FileCode className="w-7 h-7" /></div>
                   <h3 className="text-xl font-bold text-slate-900 mb-2">JSON API Export</h3>
                   <p className="text-slate-500 mb-6 text-sm leading-relaxed">Structured data for developers and integrations. Full schema including history logs.</p>
                   <button onClick={() => downloadData('JSON')} className="w-full bg-slate-50 text-slate-700 font-bold py-3 rounded-xl border border-slate-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all">Download JSON</button>
               </div>
          </div>

          <div className="mt-16 bg-blue-900 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                  <h4 className="text-xl font-bold mb-2">Developer API Access</h4>
                  <p className="text-blue-200 text-sm max-w-md">Get real-time access to the registry via our secure REST API. Request an API key for higher rate limits.</p>
              </div>
              <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 shadow-lg whitespace-nowrap">Read Documentation</button>
          </div>
      </div>
  );

  const renderFileReport = () => {
    const company = companies.find(c => c.id === currentUser?.companyId);
    if (!company) return null;
    const year = new Date().getFullYear() - 1;

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
             <div className="bg-white max-w-lg w-full p-8 rounded-2xl shadow-xl border border-slate-200">
                 <button onClick={() => setView('PORTAL_DASHBOARD')} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-2 text-sm font-bold"><ArrowLeft className="w-4 h-4" /> Cancel</button>
                 <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">File Annual Report: {year}</h2>
                 <p className="text-slate-500 text-sm mb-6">Submit financial summary for registry validation.</p>
                 
                 <div className="space-y-5">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Total Revenue (SLE)</label>
                         <input id="reportRevenue" type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900" placeholder="0.00" />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Transaction Volume (Count)</label>
                         <input id="reportVolume" type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900" placeholder="0" />
                     </div>
                     
                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
                         <input id="publishWebsite" type="checkbox" className="mt-1 h-5 w-5 text-blue-600 rounded focus:ring-blue-500" />
                         <div>
                             <label htmlFor="publishWebsite" className="block text-sm font-bold text-blue-900">Auto-Generate & Publish Website</label>
                             <p className="text-xs text-blue-700 mt-1">Create a public-facing business profile based on your registry data automatically.</p>
                         </div>
                     </div>

                     <button 
                        onClick={() => {
                            const rev = Number((document.getElementById('reportRevenue') as HTMLInputElement).value);
                            const vol = Number((document.getElementById('reportVolume') as HTMLInputElement).value);
                            const pub = (document.getElementById('publishWebsite') as HTMLInputElement).checked;
                            if (rev >= 0 && vol >= 0) {
                                handleUserSubmitReport(company.id, year, rev, vol, pub);
                            } else {
                                alert("Please enter valid figures.");
                            }
                        }}
                        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all mt-4"
                     >
                         Submit Report
                     </button>
                 </div>
             </div>
        </div>
    );
  };

  const renderGeneratedWebsite = () => {
    if (!selectedCompany) return null;
    
    // Simple template for the generated website
    return (
        <div className="bg-white min-h-screen font-sans text-slate-800">
            {/* Generated Header */}
            <header className="bg-slate-900 text-white py-6 px-4 md:px-8">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            {selectedCompany.businessLogo ? <img src={selectedCompany.businessLogo} className="w-8 h-8 rounded object-cover" /> : <Building2 className="w-8 h-8" />}
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">{selectedCompany.name}</h1>
                    </div>
                    <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
                        <a href="#about" className="hover:text-white">About</a>
                        <a href="#services" className="hover:text-white">Services</a>
                        <a href="#contact" className="hover:text-white">Contact</a>
                    </nav>
                    <button onClick={() => setView(currentUser ? 'PORTAL_DASHBOARD' : 'SEARCH')} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-white flex items-center gap-1">
                        <LogOut className="w-3 h-3" /> Exit Site
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-slate-100 py-20 px-4 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Welcome to {selectedCompany.name}</h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                    We are a registered {selectedCompany.legalForm} committed to excellence in Sierra Leone.
                </p>
                <div className="flex justify-center gap-4">
                    <a href="#contact" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-colors">Contact Us</a>
                    <a href="#about" className="bg-white text-slate-700 px-8 py-3 rounded-full font-bold shadow-md hover:bg-slate-50 transition-colors">Learn More</a>
                </div>
            </div>

            {/* About / Info */}
            <div id="about" className="max-w-6xl mx-auto py-16 px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="text-2xl font-bold mb-4 text-slate-900">About Our Company</h3>
                    <p className="text-slate-600 leading-relaxed mb-6">
                        Established in {new Date(selectedCompany.registrationDate).getFullYear()}, {selectedCompany.name} has been a key player in the local economy. 
                        We are officially registered with the Sierra Leone Business Registry (Reg: {selectedCompany.registryCode}).
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Officially Registered Entity
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Compliant with Local Regulations
                        </li>
                        <li className="flex items-center gap-3 text-slate-700">
                            <CheckCircle className="w-5 h-5 text-green-500" /> Verified Address in {selectedCompany.address.split(',').pop()?.trim()}
                        </li>
                    </ul>
                </div>
                <div className="bg-slate-200 rounded-2xl h-80 flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-16 h-16" />
                </div>
            </div>

            {/* Stats / Trust */}
            <div className="bg-blue-900 text-white py-16">
                 <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                     <div>
                         <div className="text-4xl font-bold mb-2">{new Date().getFullYear() - new Date(selectedCompany.registrationDate).getFullYear()}</div>
                         <div className="text-blue-300 text-sm font-bold uppercase">Years Active</div>
                     </div>
                     <div>
                         <div className="text-4xl font-bold mb-2">100%</div>
                         <div className="text-blue-300 text-sm font-bold uppercase">Verified</div>
                     </div>
                     <div>
                         <div className="text-4xl font-bold mb-2">{selectedCompany.managementBoard.length}</div>
                         <div className="text-blue-300 text-sm font-bold uppercase">Key Executives</div>
                     </div>
                     <div>
                         <div className="text-4xl font-bold mb-2">SL</div>
                         <div className="text-blue-300 text-sm font-bold uppercase">Local Focus</div>
                     </div>
                 </div>
            </div>

            {/* Contact */}
            <div id="contact" className="max-w-4xl mx-auto py-16 px-4 text-center">
                <h3 className="text-3xl font-bold mb-8 text-slate-900">Get in Touch</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                        <h4 className="font-bold mb-2">Visit Us</h4>
                        <p className="text-slate-600 text-sm">{selectedCompany.address}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                         <div className="w-8 h-8 text-blue-600 mx-auto mb-4 flex items-center justify-center font-bold">@</div>
                        <h4 className="font-bold mb-2">Email Us</h4>
                        <p className="text-slate-600 text-sm">{selectedCompany.contactEmail}</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
                        <h4 className="font-bold mb-2">Call Us</h4>
                        <p className="text-slate-600 text-sm">{selectedCompany.contactPhone}</p>
                    </div>
                </div>
            </div>

            <footer className="bg-slate-900 text-slate-500 py-8 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} {selectedCompany.name}. All rights reserved.</p>
                <p className="mt-2 text-xs">Site generated by Sierra Leone Business Registry Platform.</p>
            </footer>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 relative" onMouseOver={handleGlobalMouseOver}>
      {view !== 'GENERATED_WEBSITE' && renderNavbar()}
      <main className="flex-grow">
        {view === 'SEARCH' && renderSearch()}
        {view === 'COMPANY_DETAIL' && renderCompanyDetail()}
        {view === 'PORTAL_LOGIN' && renderLogin()}
        {view === 'ADMIN_DASHBOARD' && renderAdminDashboard()}
        {view === 'PORTAL_DASHBOARD' && renderPortalDashboard()}
        {view === 'NAME_CHECK' && renderNameCheckView()}
        {view === 'OPEN_DATA' && renderOpenData()}
        {view === 'PORTAL_FILE_REPORT' && renderFileReport()}
        {view === 'PORTAL_EDIT_DETAILS' && (editingCompanyId || editingCompanyId === NEW_COMPANY_ID) && (
          <EditCompanyDetails
            company={editingCompanyId === NEW_COMPANY_ID ? EMPTY_COMPANY : companies.find(c => c.id === editingCompanyId)!}
            currentUser={currentUser}
            onBack={() => setView(currentUser?.role === 'ADMIN' ? 'ADMIN_DASHBOARD' : 'PORTAL_DASHBOARD')}
            onSave={(id, updates) => {
                if (id === NEW_COMPANY_ID) handleCreateCompany(updates);
                else handleUpdateCompanyDetails(id, updates);
            }}
          />
        )}
        {view === 'DUE_DILIGENCE' && renderDueDiligence()}
        {view === 'GENERATED_WEBSITE' && renderGeneratedWebsite()}
      </main>
      {view !== 'GENERATED_WEBSITE' && (
          <footer className="bg-blue-950 text-white py-12 border-t border-blue-900 relative z-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <div className="flex justify-center items-center gap-2 mb-6 text-blue-300 text-sm font-mono animate-pulse">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    LIVE LEDGER SYNC: BLOCK #8921204
                </div>
                <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Government of Sierra Leone. Powered by Blockchain Technology.</p>
            </div>
          </footer>
      )}
      <AIAssistant onThinking={setIsAIThinking} />
      <SignLanguageInterpreter isActive={signLanguageMode} isSigning={isAIThinking} hoverText={hoverText} />
    </div>
  );
}