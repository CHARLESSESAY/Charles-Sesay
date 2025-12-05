import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Company, LegalForm, ReportStatus, ViewState, AuditLog, AnnualReport, Transaction } from './types';
import { generateHash, formatCurrency, formatDate } from './utils';
import { SearchFilters } from './components/SearchFilters';
import { AIAssistant } from './components/AIAssistant';
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
  ArrowRight
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_COMPANIES: Company[] = [
  {
    id: 'c1',
    registryCode: 'SL-2023-001245',
    name: 'Lion Mountains Mining Ltd',
    legalForm: LegalForm.LTD,
    registrationDate: '2020-03-15',
    capital: 5000000,
    address: '12 Wilkinson Road, Freetown',
    website: 'www.lionmines.sl',
    businessLogo: 'https://placehold.co/200x200/1e3a8a/ffffff?text=LMM',
    status: 'Active',
    managementBoard: ['Amara Bangura', 'Sarah Cole'], 
    contactEmail: 'info@lionmines.sl',
    contactPhone: '+23278 875269', // Updated registered number
    beneficialOwners: ['Global Mining Corp', 'Ibrahim Bah'],
    taxDebt: 0,
    commercialPledges: 2,
    relationships: [
        { entity: 'Global Mining Corp', type: 'Parent' },
        { entity: 'Lion Transport Services', type: 'Subsidiary' }
    ],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 12000000, transactionVolume: 4500, submissionDate: '2024-02-10', filedBy: 'Sarah Cole' },
      { year: 2022, status: ReportStatus.APPROVED, revenue: 9500000, transactionVolume: 3200, submissionDate: '2023-03-01', filedBy: 'Sarah Cole' }
    ],
    history: [
      { id: 'h1', timestamp: '2024-02-10T14:30:00Z', action: 'REPORT_SUBMITTED', details: 'Annual Report 2023 submitted', previousHash: '0x3a1f8...', hash: '0x9f2b3...', actor: 'User: S.Cole' },
      { id: 'h2', timestamp: '2020-03-15T09:00:00Z', action: 'REGISTRATION', details: 'Company Registered', previousHash: '0x00000...', hash: '0x3a1f8...', actor: 'Registrar' }
    ],
    transactions: [
        { id: 't1', date: '2024-03-01', description: 'Equipment Export', amount: 45000, type: 'CREDIT', category: 'Sales' },
        { id: 't2', date: '2024-03-05', description: 'Logistics Payment', amount: 12000, type: 'DEBIT', category: 'Operations' }
    ],
    isWebsitePublished: true
  },
  {
    id: 'c2',
    registryCode: 'SL-2021-008821',
    name: 'Salone Tech Innovators',
    legalForm: LegalForm.PLC,
    registrationDate: '2021-06-20',
    capital: 150000,
    address: '45 Siaka Stevens Street, Freetown',
    website: 'www.salonetech.com',
    businessLogo: 'https://placehold.co/200x200/2563eb/ffffff?text=STI',
    status: 'Active',
    managementBoard: ['David Mansaray'],
    contactEmail: 'hello@salonetech.com',
    contactPhone: '+23232636816', // Updated registered number
    beneficialOwners: ['David Mansaray'],
    taxDebt: 5000,
    commercialPledges: 0,
    relationships: [
        { entity: 'Freetown Hub', type: 'Partner' }
    ],
    reports: [
      { year: 2023, status: ReportStatus.MISSING }
    ],
    history: [
      { id: 'h3', timestamp: '2021-06-20T10:15:00Z', action: 'REGISTRATION', details: 'Company Registered', previousHash: '0x00000...', hash: '0x7b4c2...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: false
  },
  {
    id: 'c3',
    registryCode: 'SL-2019-003311',
    name: 'Bo Agricultural Co-op',
    legalForm: LegalForm.NGO,
    registrationDate: '2019-01-10',
    capital: 25000,
    address: '5 Bo-Kenema Highway, Bo',
    website: 'www.bo-agri.org',
    businessLogo: '', 
    status: 'Active',
    managementBoard: ['Chief Kamara'],
    contactEmail: 'contact@bo-agri.org',
    contactPhone: '+232 33 444 555',
    beneficialOwners: ['Community Trust'],
    taxDebt: 0,
    commercialPledges: 0,
    relationships: [],
    reports: [
      { year: 2023, status: ReportStatus.APPROVED, revenue: 450000, transactionVolume: 120 }
    ],
    history: [
      { id: 'h4', timestamp: '2019-01-10T08:30:00Z', action: 'REGISTRATION', details: 'Company Registered', previousHash: '0x00000...', hash: '0x2c9a1...', actor: 'Registrar' }
    ],
    transactions: [],
    isWebsitePublished: true
  }
];

type Tab = 'GENERAL' | 'REPORTS' | 'GOVERNANCE' | 'HISTORY' | 'VISUALIZER';
type ExtendedViewState = ViewState | 'PORTAL_LOGIN' | 'PORTAL_DASHBOARD' | 'PORTAL_FILE_REPORT' | 'PORTAL_EDIT_DETAILS' | 'NAME_CHECK' | 'OPEN_DATA' | 'DUE_DILIGENCE' | 'GENERATED_WEBSITE';
type LangCode = 'en' | 'zh' | 'fr' | 'es' | 'hi' | 'ru';

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
    topMembers: 'Top Members',
    contact: 'Contact',
    email: 'Email',
    phone: 'Phone',
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
  const handleLogin = (role: 'USER' | 'ADMIN') => { setCurrentUser({ name: role === 'ADMIN' ? 'Registrar Admin' : 'Amara Bangura', role: role }); setView(role === 'ADMIN' ? 'ADMIN_DASHBOARD' : 'PORTAL_DASHBOARD'); };
  
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

  const handleLogout = () => { setCurrentUser(null); setBusinessIdInput(''); setPhoneNumberInput(''); setView('SEARCH'); setLoginStep('CREDENTIALS'); setMockSmsNotification(null); };
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
             <a href="https://nib.gov.sl" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 text-xs font-bold text-blue-300 hover:text-white border border-blue-500/50 px-3 py-1.5 rounded-lg transition-colors">
                <ExternalLink className="w-3 h-3" /> NIB Link
             </a>
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
                    <span className="text-sm font-semibold text-blue-100 hidden sm:block">Hi, {currentUser.name}</span>
                    <button onClick={() => currentUser.role === 'ADMIN' ? setView('ADMIN_DASHBOARD') : setView('PORTAL_DASHBOARD')} className={`px-4 py-2 rounded-lg text-sm font-bold bg-blue-600 hover:bg-blue-500 border border-blue-500`}>
                        {t('dashboard')}
                    </button>
                    <button onClick={handleLogout} className="text-blue-300 hover:text-red-400 p-2"><LogOut className="w-5 h-5" /></button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
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
                        </div>
                        <div>
                             <h3 className="text-lg font-serif font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">{t('contact')}</h3>
                             <dl className="space-y-4">
                                <div><dt className="text-xs font-bold text-slate-400 uppercase">{t('email')}</dt><dd className="text-blue-600 font-medium">{selectedCompany.contactEmail}</dd></div>
                                <div><dt className="text-xs font-bold text-slate-400 uppercase">{t('phone')}</dt><dd className="text-slate-800">{selectedCompany.contactPhone}</dd></div>
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
                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
                        <Network className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold">Ownership Graph Visualization</p>
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
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 text-center">{t('login')}</h2>
        
        <div className="flex mb-6 bg-slate-100 p-1 rounded-xl">
          <button onClick={() => { setLoginTab('REGISTRAR'); setLoginStep('CREDENTIALS'); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginTab === 'REGISTRAR' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Registrar</button>
          <button onClick={() => { setLoginTab('BUSINESS'); setLoginStep('CREDENTIALS'); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginTab === 'BUSINESS' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Business</button>
        </div>

        {loginTab === 'REGISTRAR' ? (
          <div className="space-y-4 animate-fade-in-up">
             <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center mb-2">
                 <ShieldCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                 <p className="text-xs text-blue-800 font-bold">OFFICIAL GOVERNMENT PORTAL</p>
                 <p className="text-xs text-blue-600 mt-1">Authorized personnel only.</p>
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Official ID</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter ID" />
             </div>
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Password</label>
                <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
             </div>
             <button onClick={() => handleLogin('ADMIN')} className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors mt-2 shadow-lg">Login as Registrar Admin</button>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in-up">
             {loginStep === 'CREDENTIALS' ? (
                 <>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Registry Code</label>
                        <input type="text" value={businessIdInput} onChange={(e) => setBusinessIdInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" placeholder="e.g. SL-2023-..." />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Access Key</label>
                        <input type="password" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Registered Phone Number</label>
                        <input type="tel" value={phoneNumberInput} onChange={(e) => setPhoneNumberInput(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+232..." />
                    </div>
                    <button onClick={handleBusinessCredentialCheck} className="w-full bg-blue-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors mt-2 shadow-lg flex items-center justify-center gap-2">
                        Verify & Send Code <ArrowRight className="w-4 h-4" />
                    </button>
                 </>
             ) : (
                 <>
                    {/* Simulated SMS Notification */}
                    {mockSmsNotification && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-800 rounded-xl flex items-center gap-3 animate-fade-in-up shadow-sm">
                            <div className="bg-green-200 p-2 rounded-lg"><Smartphone className="w-5 h-5 text-green-700" /></div>
                            <div>
                                <p className="text-xs font-bold uppercase opacity-70">Simulated SMS</p>
                                <p className="font-bold">{mockSmsNotification}</p>
                            </div>
                            <button onClick={() => setMockSmsNotification(null)} className="ml-auto text-green-600 hover:text-green-800"><XCircle className="w-5 h-5" /></button>
                        </div>
                    )}

                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center mb-2">
                        <Smartphone className="w-8 h-8 text-blue-600 mx-auto mb-2 animate-bounce" />
                        <p className="text-sm font-bold text-blue-900">2-Factor Authentication</p>
                        <p className="text-xs text-blue-600 mt-1">Please enter the 4-digit code sent to your registered mobile number.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Notification Code (OTP)</label>
                        <input type="text" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="w-full px-4 py-3 bg-white border-2 border-blue-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:outline-none text-center text-2xl font-mono tracking-widest" placeholder="0000" maxLength={4} />
                    </div>
                    <button onClick={handleBusinessOtpCheck} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition-colors mt-2 shadow-lg">
                        Verify & Login
                    </button>
                    <button onClick={() => setLoginStep('CREDENTIALS')} className="w-full text-slate-500 text-sm font-bold mt-2 hover:text-slate-700">Back</button>
                 </>
             )}
          </div>
        )}
      </div>
    </div>
  );

  const renderGeneratedWebsite = () => {
    if (!selectedCompany) return null;
    return (
        <div className="min-h-screen bg-white">
            {/* Generated Website Header */}
            <header className="bg-slate-900 text-white py-4 px-6 fixed top-0 w-full z-50 flex justify-between items-center shadow-md">
                <div className="font-bold font-serif text-xl tracking-wider">{selectedCompany.name}</div>
                <button onClick={() => setView('PORTAL_DASHBOARD')} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition-colors">Exit Website Preview</button>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-20 px-6 text-center bg-slate-50">
                <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
                    {selectedCompany.businessLogo ? <img src={selectedCompany.businessLogo} className="w-full h-full object-cover rounded-full" /> : <Building2 className="w-12 h-12" />}
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">{selectedCompany.name}</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">Registered in Sierra Leone ({selectedCompany.registryCode}). Committed to transparency and excellence.</p>
            </section>

            {/* About / Registry Info */}
            <section className="py-16 px-6 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-4">About Us</h2>
                        <p className="text-slate-600 leading-relaxed">
                            We are a {selectedCompany.legalForm} operating out of {selectedCompany.address}. 
                            Our company was officially registered on {formatDate(selectedCompany.registrationDate)}.
                            We pride ourselves on maintaining full compliance with the Sierra Leone Business Registry.
                        </p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                        <h3 className="font-bold text-slate-900 mb-4">Official Details</h3>
                        <ul className="space-y-3 text-sm">
                             <li className="flex justify-between border-b border-slate-200 pb-2"><span>Type</span> <span className="font-bold">{selectedCompany.legalForm}</span></li>
                             <li className="flex justify-between border-b border-slate-200 pb-2"><span>Status</span> <span className="font-bold text-green-600">{selectedCompany.status}</span></li>
                             <li className="flex justify-between border-b border-slate-200 pb-2"><span>Contact</span> <span className="font-bold">{selectedCompany.contactPhone}</span></li>
                             <li className="flex justify-between"><span>Email</span> <span className="font-bold text-blue-600">{selectedCompany.contactEmail}</span></li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Financial Transparency (Public Data) */}
            <section className="py-16 px-6 bg-blue-900 text-white">
                 <div className="max-w-4xl mx-auto text-center">
                     <h2 className="text-2xl font-serif font-bold mb-8">Financial Transparency</h2>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                             <div className="text-3xl font-bold mb-1">{tCurrency(selectedCompany.reports[0]?.revenue || 0)}</div>
                             <div className="text-sm opacity-70">Annual Revenue (Last Filed)</div>
                         </div>
                         <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                             <div className="text-3xl font-bold mb-1">{selectedCompany.reports[0]?.year || 'N/A'}</div>
                             <div className="text-sm opacity-70">Fiscal Year Verified</div>
                         </div>
                         <div className="bg-white/10 p-6 rounded-xl backdrop-blur-sm">
                             <div className="text-3xl font-bold mb-1">{selectedCompany.capital > 0 ? tCurrency(selectedCompany.capital) : 'N/A'}</div>
                             <div className="text-sm opacity-70">Registered Capital</div>
                         </div>
                     </div>
                     <p className="mt-8 text-sm opacity-60">Data verified by the SL Business Registry Blockchain.</p>
                 </div>
            </section>

            <footer className="py-8 text-center text-slate-400 text-sm bg-slate-950">
                <p>&copy; {new Date().getFullYear()} {selectedCompany.name}. All rights reserved.</p>
            </footer>
        </div>
    );
  };

  const renderAdminDashboard = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Registrar Dashboard</h1>
      
      {/* Registration Form */}
      <div className="bg-slate-900 text-white rounded-2xl shadow-lg p-8 mb-10 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 bg-green-500/20 rounded-lg border border-green-500/30"><Plus className="w-6 h-6 text-green-400" /></div>
          <h3 className="font-bold text-xl">Register New Legal Entity</h3>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleRegistrarAddEntry(
              formData.get('name') as string,
              formData.get('form') as LegalForm,
              formData.get('code') as string
          );
          (e.target as HTMLFormElement).reset();
        }} className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            <input name="name" placeholder="Entity Name" className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500" required />
            <select name="form" className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none">
                {Object.values(LegalForm).map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <input name="code" placeholder="Registry Code (e.g. SL-2024-...)" className="bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-slate-500" required />
            <button type="submit" className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-900/20">
              <Plus className="w-4 h-4" /> Add to Registry
            </button>
        </form>
      </div>

       {/* Status Management */}
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-10">
           <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2"><Settings className="w-5 h-5 text-slate-500" /> Registry Status Management</h3>
           </div>
           <div className="max-h-96 overflow-y-auto">
               <table className="w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500 font-bold uppercase">
                       <tr>
                           <th className="px-6 py-3">Company</th>
                           <th className="px-6 py-3">Registry Code</th>
                           <th className="px-6 py-3">Current Status</th>
                           <th className="px-6 py-3">Action</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {companies.map(c => (
                           <tr key={c.id} className="hover:bg-slate-50">
                               <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                               <td className="px-6 py-4 font-mono text-slate-500">{c.registryCode}</td>
                               <td className="px-6 py-4">
                                   <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                               </td>
                               <td className="px-6 py-4">
                                   <select 
                                       className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-bold text-slate-700"
                                       value={c.status}
                                       onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                   >
                                       <option value="Active">Active</option>
                                       <option value="Inactive">Inactive</option>
                                       <option value="Liquidated">Liquidated</option>
                                       <option value="Bankruptcy">Bankruptcy</option>
                                   </select>
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
       </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-sm font-bold uppercase mb-2">Pending Reports</div>
           <div className="text-4xl font-serif font-bold text-blue-600">{companies.reduce((acc, c) => acc + c.reports.filter(r => r.status === ReportStatus.SUBMITTED).length, 0)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-sm font-bold uppercase mb-2">Total Entities</div>
           <div className="text-4xl font-serif font-bold text-slate-900">{companies.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
           <div className="text-slate-500 text-sm font-bold uppercase mb-2">Flagged for Review</div>
           <div className="text-4xl font-serif font-bold text-red-500">{companies.filter(c => c.taxDebt > 0).length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800">Filings Requiring Approval</h3>
           </div>
           <div className="divide-y divide-slate-100">
              {companies.flatMap(c => c.reports.filter(r => r.status === ReportStatus.SUBMITTED).map(r => ({ company: c, report: r }))).map((item, idx) => (
                  <div key={idx} className="p-6 flex items-center justify-between">
                      <div>
                          <div className="font-bold text-slate-900">{item.company.name}</div>
                          <div className="text-sm text-slate-500">Annual Report {item.report.year} • Rev: {tCurrency(item.report.revenue || 0)}</div>
                      </div>
                      <div className="flex gap-3">
                          <button onClick={() => handleAdminReviewReport(item.company.id, item.report.year, true)} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-bold hover:bg-green-200">Approve</button>
                          <button onClick={() => handleAdminReviewReport(item.company.id, item.report.year, false)} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-bold hover:bg-red-200">Reject</button>
                      </div>
                  </div>
              ))}
              {companies.every(c => !c.reports.some(r => r.status === ReportStatus.SUBMITTED)) && (
                  <div className="p-12 text-center text-slate-500">No pending reports to review.</div>
              )}
           </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">Global Registry Activity Log</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Live Feed</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
                {companies
                  .flatMap(c => c.history.map(h => ({...h, companyName: c.name})))
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 10)
                  .map((activity, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-slate-800">{activity.companyName}</span>
                            <span className="text-xs text-slate-400 font-mono">{formatDate(activity.timestamp)}</span>
                        </div>
                        <p className="text-sm text-slate-600">{activity.details}</p>
                        <div className="flex justify-between items-center mt-2">
                             <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{activity.action}</span>
                             <span className="text-[10px] font-mono text-blue-400 truncate max-w-[150px]">{activity.hash}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );

  const renderPortalDashboard = () => {
    const managedCompany = currentUser?.role === 'BUSINESS' 
        ? companies.find(c => c.id === currentUser.companyId) 
        : companies[0];

    if (!managedCompany) return <div className="p-10 text-center">No company associated.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">My Portal</h1>
                    <p className="text-slate-500 mt-1">Managing: <span className="font-bold text-blue-900">{managedCompany.name}</span></p>
                </div>
                <button onClick={() => { setEditingCompanyId(managedCompany.id); setView('PORTAL_EDIT_DETAILS'); }} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm font-bold text-slate-700 hover:bg-slate-50">
                    <Edit className="w-4 h-4" /> Edit Profile
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Card */}
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white shadow-xl h-fit">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-lg"><Activity className="w-6 h-6" /></div>
                        <h3 className="font-bold">Compliance Status</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                            <span className="text-blue-100 text-sm">Registry Status</span>
                            <span className="font-bold bg-green-400/20 text-green-300 px-2 py-0.5 rounded text-sm">{managedCompany.status}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                            <span className="text-blue-100 text-sm">Last Filing</span>
                            <span className="font-bold">{managedCompany.reports[0]?.year || 'N/A'}</span>
                        </div>
                         <div className="flex justify-between items-center bg-white/10 p-3 rounded-xl">
                            <span className="text-blue-100 text-sm">Tax Standing</span>
                            <span className={`font-bold ${managedCompany.taxDebt > 0 ? 'text-red-300' : 'text-green-300'}`}>{managedCompany.taxDebt > 0 ? 'Outstanding' : 'Clear'}</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                     
                     {/* Website Builder Teaser */}
                     <div className="bg-purple-50 rounded-2xl border border-purple-100 p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                             <div className="bg-purple-100 p-3 rounded-xl text-purple-700"><Layout className="w-6 h-6" /></div>
                             <div>
                                 <h3 className="font-bold text-purple-900">Public Business Website</h3>
                                 <p className="text-sm text-purple-700/70">{managedCompany.isWebsitePublished ? 'Your website is live and synced with registry data.' : 'Create a free landing page based on your report entries.'}</p>
                             </div>
                         </div>
                         <button onClick={() => { setSelectedCompanyId(managedCompany.id); setView('GENERATED_WEBSITE'); }} className="px-5 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow hover:bg-purple-700 transition-colors">
                             {managedCompany.isWebsitePublished ? 'View Live Site' : 'Preview & Build'}
                         </button>
                     </div>

                     <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <h3 className="font-bold text-lg text-slate-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button onClick={() => { setReportingCompanyId(managedCompany.id); setView('PORTAL_FILE_REPORT'); }} className="flex items-center gap-4 p-4 rounded-xl border border-blue-100 bg-blue-50 text-blue-900 hover:bg-blue-100 transition-colors text-left group">
                                <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm group-hover:scale-110 transition-transform"><FileText className="w-6 h-6" /></div>
                                <div>
                                    <div className="font-bold">File Annual Report</div>
                                    <div className="text-xs text-blue-700/70">Submit financial data for 2024</div>
                                </div>
                            </button>
                             <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100 transition-colors text-left group">
                                <div className="bg-white p-2 rounded-lg text-slate-600 shadow-sm group-hover:scale-110 transition-transform"><FileSpreadsheet className="w-6 h-6" /></div>
                                <div>
                                    <div className="font-bold">Download Certificate</div>
                                    <div className="text-xs text-slate-500">Get official registry proof</div>
                                </div>
                            </button>
                        </div>
                     </div>

                     {/* Transaction Ledger */}
                     <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                             <h3 className="font-bold text-slate-800">Business Transaction Ledger</h3>
                             <button onClick={() => {
                                 const desc = prompt("Transaction Description:");
                                 const amt = prompt("Amount:");
                                 const type = confirm("Is this income (OK for Yes) or expense (Cancel)?") ? 'CREDIT' : 'DEBIT';
                                 if (desc && amt) handleAddTransaction(managedCompany.id, desc, Number(amt), type);
                             }} className="text-xs bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-slate-800">+ Add Entry</button>
                         </div>
                         <div className="max-h-60 overflow-y-auto">
                            {managedCompany.transactions.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 text-sm">No transactions recorded yet.</div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-bold">
                                        <tr>
                                            <th className="px-6 py-3 text-left">Date</th>
                                            <th className="px-6 py-3 text-left">Description</th>
                                            <th className="px-6 py-3 text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {managedCompany.transactions.map(tx => (
                                            <tr key={tx.id}>
                                                <td className="px-6 py-3 text-slate-500 font-mono">{tx.date}</td>
                                                <td className="px-6 py-3 text-slate-800 flex items-center gap-2">
                                                    {tx.type === 'CREDIT' ? <TrendingUp className="w-4 h-4 text-green-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                                                    {tx.description}
                                                </td>
                                                <td className={`px-6 py-3 text-right font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-slate-600'}`}>
                                                    {tx.type === 'CREDIT' ? '+' : '-'}{tCurrency(tx.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                         </div>
                     </div>

                     <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 font-bold text-slate-800">Filing History</div>
                         <div className="divide-y divide-slate-100">
                             {managedCompany.reports.map(r => (
                                 <div key={r.year} className="px-6 py-4 flex justify-between items-center">
                                     <div>
                                         <div className="font-bold text-slate-900">Annual Report {r.year}</div>
                                         <div className="text-xs text-slate-500">Filed on {r.submissionDate || 'Pending'}</div>
                                     </div>
                                     <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${r.status === ReportStatus.APPROVED ? 'bg-green-100 text-green-700' : r.status === ReportStatus.SUBMITTED ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-600'}`}>{r.status}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
  };

  const renderNameCheckView = () => (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 text-center">
            <div className="inline-flex p-4 rounded-full bg-blue-50 text-blue-600 mb-6">
                <Search className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Check Name Availability</h2>
            <p className="text-slate-500 mb-8">Ensure your business name is unique before registration.</p>
            
            <div className="relative mb-6">
                <input 
                    type="text" 
                    value={nameCheckValue}
                    onChange={(e) => { setNameCheckValue(e.target.value); setNameAvailability('IDLE'); }}
                    className="w-full px-5 py-4 text-lg bg-slate-50 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all text-center font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-normal"
                    placeholder="Enter desired name..." 
                />
            </div>
            
            <button 
                onClick={() => checkNameAvailability(nameCheckValue)}
                disabled={!nameCheckValue.trim() || nameAvailability === 'CHECKING'}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 mb-6 disabled:opacity-50"
            >
                {nameAvailability === 'CHECKING' ? 'Checking Database...' : 'Check Availability'}
            </button>

            {nameAvailability === 'AVAILABLE' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 animate-fade-in-up">
                    <CheckCircle className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="font-bold">"{nameCheckValue}" is available!</p>
                    <p className="text-xs mt-1 opacity-80">You can proceed with registration.</p>
                </div>
            )}
            
            {nameAvailability === 'TAKEN' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 animate-fade-in-up">
                    <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <p className="font-bold">"{nameCheckValue}" is already taken.</p>
                    <p className="text-xs mt-1 opacity-80">Please try a different variation.</p>
                </div>
            )}
        </div>
    </div>
  );

  const renderOpenData = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-serif font-bold text-slate-900 mb-8">Open Data Portal</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-4"><Database className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Registered Companies Dataset</h3>
                <p className="text-slate-500 mb-6 text-sm">Full list of active and inactive companies, including registration dates and legal forms. Updated daily.</p>
                <div className="flex flex-wrap gap-3">
                    <button onClick={() => downloadData('CSV')} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200">Download CSV</button>
                    <button onClick={() => downloadData('JSON')} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200">Download JSON</button>
                    <button onClick={() => downloadData('XML')} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200">Download XML</button>
                    <button onClick={() => downloadData('XLSX')} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200">Download Excel</button>
                </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-colors">
                <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-4"><FileCode className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Annual Reports Schema</h3>
                <p className="text-slate-500 mb-6 text-sm">Structure and metadata definitions for the annual reporting standard used by the registry.</p>
                <button className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-sm hover:bg-slate-200">View Schema</button>
            </div>
        </div>
    </div>
  );

  const renderFileReport = () => {
    const company = companies.find(c => c.id === reportingCompanyId);
    if (!company) return null;

    return (
        <div className="max-w-2xl mx-auto px-4 py-10">
            <button onClick={() => setView('PORTAL_DASHBOARD')} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-700 mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</button>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 p-6">
                    <h2 className="text-xl font-serif font-bold text-slate-900">File Annual Report</h2>
                    <p className="text-sm text-slate-500 mt-1">For {company.name} ({company.registryCode})</p>
                </div>
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Fiscal Year</label>
                        <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" defaultValue={2024}>
                            <option value={2024}>2024</option>
                            <option value={2023}>2023</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Total Revenue (SLE)</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="0.00" id="reportRevenue" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Transaction Volume</label>
                        <input type="number" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="0" id="reportVolume" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Notes</label>
                        <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl h-24" placeholder="Optional notes..."></textarea>
                    </div>
                    <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
                        <input type="checkbox" id="publishWebsite" className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
                        <div>
                            <label htmlFor="publishWebsite" className="font-bold text-purple-900">Publish as Business Website</label>
                            <p className="text-xs text-purple-700">Update your public landing page with this latest data.</p>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-4">
                        <button 
                            onClick={() => {
                                const rev = (document.getElementById('reportRevenue') as HTMLInputElement).value;
                                const vol = (document.getElementById('reportVolume') as HTMLInputElement).value;
                                const publish = (document.getElementById('publishWebsite') as HTMLInputElement).checked;
                                handleUserSubmitReport(company.id, 2024, Number(rev), Number(vol), publish);
                            }}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Submit Report
                        </button>
                        <button onClick={() => setView('PORTAL_DASHBOARD')} className="px-6 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderEditCompanyDetails = () => {
    const company = companies.find(c => c.id === editingCompanyId);
    if (!company) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <button onClick={() => setView(currentUser?.role === 'ADMIN' ? 'ADMIN_DASHBOARD' : 'PORTAL_DASHBOARD')} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-700 mb-6"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-slate-900">Edit Company Profile</h2>
                        <p className="text-sm text-slate-500 mt-1">{company.name}</p>
                    </div>
                    <Save className="w-5 h-5 text-slate-400" />
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                defaultValue={company.contactEmail}
                                id="editEmail"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <input 
                                type="text" 
                                defaultValue={company.contactPhone}
                                id="editPhone"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Office Address</label>
                        <input 
                            type="text" 
                            defaultValue={company.address}
                            id="editAddress"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Website URL</label>
                        <input 
                            type="text" 
                            defaultValue={company.website}
                            id="editWebsite"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                        <button onClick={() => setView(currentUser?.role === 'ADMIN' ? 'ADMIN_DASHBOARD' : 'PORTAL_DASHBOARD')} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                        <button 
                            onClick={() => {
                                handleUpdateCompanyDetails(company.id, {
                                    contactEmail: (document.getElementById('editEmail') as HTMLInputElement).value,
                                    contactPhone: (document.getElementById('editPhone') as HTMLInputElement).value,
                                    address: (document.getElementById('editAddress') as HTMLInputElement).value,
                                    website: (document.getElementById('editWebsite') as HTMLInputElement).value
                                });
                            }}
                            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
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
        {view === 'PORTAL_EDIT_DETAILS' && renderEditCompanyDetails()}
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