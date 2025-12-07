import React, { useState } from 'react';
import { ArrowLeft, Save, Briefcase, Trash2, Building2, Upload, X, Calendar, FileText, Hash } from 'lucide-react';
import { Company, LegalForm } from '../types';

interface EditCompanyDetailsProps {
  company: Company;
  currentUser: { name: string; role: 'USER' | 'ADMIN' | 'BUSINESS'; companyId?: string } | null;
  onBack: () => void;
  onSave: (id: string, updates: Partial<Company>) => void;
}

export const EditCompanyDetails: React.FC<EditCompanyDetailsProps> = ({ company, currentUser, onBack, onSave }) => {
  const [tempManagementBoard, setTempManagementBoard] = useState(company.managementBoard);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(company.businessLogo);

  const isBusiness = currentUser?.role === 'BUSINESS';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isNew = company.id === 'NEW_ENTRY';

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a fake local URL for preview/storage (in a real app, upload to server)
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <button onClick={onBack} className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-700 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-900">{isNew ? 'Register New Entity' : 'Edit Company Profile'}</h2>
            {!isNew && <p className="text-sm text-slate-500 mt-1">{company.name}</p>}
          </div>
          <Save className="w-5 h-5 text-slate-400" />
        </div>
        <div className="p-8 space-y-8">
          
          {isNew ? (
             // SIMPLIFIED REGISTRAR VIEW
             <div className="space-y-6 max-w-2xl mx-auto">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div className="bg-white p-2 rounded-full h-8 w-8 flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0">
                        <FileText className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-blue-900 font-bold text-sm">New Entity Registration</h4>
                        <p className="text-blue-700 text-xs mt-1">Enter the mandatory legal details to create a new registry record. The business admin can claim this record later to add logos and additional details.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Entity Name <span className="text-red-500">*</span></label>
                    <input id="editName" type="text" placeholder="Official Business Name" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-serif font-bold text-lg text-slate-900 placeholder:font-sans placeholder:font-normal" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registry Code <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                            <input id="editRegCode" type="text" placeholder="e.g. PV 12345" className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Legal Form <span className="text-red-500">*</span></label>
                        <select id="editLegalForm" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-slate-700">
                             {Object.values(LegalForm).map(form => (
                                 <option key={form} value={form}>{form}</option>
                             ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Registration Date <span className="text-red-500">*</span></label>
                        <div className="relative">
                             <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                             <input id="editRegDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Office Address <span className="text-red-500">*</span></label>
                        <input id="editAddress" type="text" placeholder="City, Street, Number" className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
                    </div>
                </div>
             </div>
          ) : (
             // EXISTING EDIT VIEW
             <>
                {/* Logo Upload Section */}
                <div className="flex flex-col sm:flex-row gap-6 items-start border-b border-slate-100 pb-8">
                    <div className="h-24 w-24 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 relative group shadow-inner">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                        ) : (
                            <Building2 className="w-10 h-10 text-slate-300" />
                        )}
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-bold text-slate-900 mb-1">Business Logo</label>
                        <p className="text-xs text-slate-500 mb-4">Upload a transparent PNG or JPG to represent your brand on the registry and generated website. Max 2MB.</p>
                        
                        {isBusiness && (
                        <div className="flex items-center gap-3">
                            <label className="cursor-pointer bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all flex items-center gap-2 shadow-sm">
                                <Upload className="w-3 h-3" />
                                Upload New Logo
                                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                            </label>
                            {logoPreview && (
                                <button onClick={() => setLogoPreview(undefined)} className="text-red-500 text-xs font-bold hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1">
                                    <X className="w-3 h-3" /> Remove
                                </button>
                            )}
                        </div>
                        )}
                        {!isBusiness && <p className="text-xs text-orange-600 font-bold bg-orange-50 inline-block px-2 py-1 rounded">Locked: Only business owner can update.</p>}
                    </div>
                </div>

                {/* Basic Contact Info */}
                <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Email Address</label>
                        <input
                        type="email"
                        defaultValue={company.contactEmail}
                        id="editEmail"
                        disabled={!isBusiness} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Phone Number</label>
                        <input
                        type="text"
                        defaultValue={company.contactPhone}
                        id="editPhone"
                        disabled={!isBusiness}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100"
                        />
                    </div>
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Office Address</label>
                    <input
                        type="text"
                        defaultValue={company.address}
                        id="editAddress"
                        disabled={!isBusiness}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                    </div>
                    <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Website URL</label>
                    <input
                        type="text"
                        defaultValue={company.website}
                        id="editWebsite"
                        disabled={!isBusiness}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                    </div>
                </div>

                {/* Top Runners Management */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Top Runners (Management)</h3>
                    {isBusiness && (
                        <button
                        onClick={() => setTempManagementBoard([...tempManagementBoard, { name: '', position: '' }])}
                        className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-bold hover:bg-blue-200 transition-colors"
                        >
                        + Add Executive
                        </button>
                    )}
                    </div>
                    <div className="space-y-3">
                    {tempManagementBoard.map((member, index) => (
                        <div key={index} className="flex gap-3">
                        <input
                            value={member.name}
                            placeholder="Name"
                            disabled={!isBusiness}
                            onChange={(e) => {
                            const newBoard = [...tempManagementBoard];
                            newBoard[index].name = e.target.value;
                            setTempManagementBoard(newBoard);
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-60 disabled:bg-slate-100"
                        />
                        <input
                            value={member.position}
                            placeholder="Position"
                            disabled={!isBusiness}
                            onChange={(e) => {
                            const newBoard = [...tempManagementBoard];
                            newBoard[index].position = e.target.value;
                            setTempManagementBoard(newBoard);
                            }}
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm disabled:opacity-60 disabled:bg-slate-100"
                        />
                        {isBusiness && (
                            <button
                            onClick={() => {
                                const newBoard = tempManagementBoard.filter((_, i) => i !== index);
                                setTempManagementBoard(newBoard);
                            }}
                            className="text-red-400 hover:text-red-600 p-2"
                            >
                            <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                        </div>
                    ))}
                    {tempManagementBoard.length === 0 && <p className="text-sm text-slate-400 italic">No management members listed.</p>}
                    </div>
                </div>

                {/* Admin Only Controls */}
                {isAdmin && (
                    <>
                    <div className="space-y-4">
                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-600" /> Admin Controls
                        </h3>

                        <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <label className="block text-xs font-bold text-red-800 mb-2">Bank Standing Determination (Tax Debt in SLE)</label>
                        <div className="flex gap-4 items-center">
                            <input
                            type="number"
                            defaultValue={company.taxDebt}
                            id="editTaxDebt"
                            className="flex-1 px-4 py-3 bg-white border border-red-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm font-bold text-red-900"
                            />
                            <p className="text-xs text-red-600 w-1/3">Set to 0 for Good Standing. Any positive value indicates debt.</p>
                        </div>
                        </div>

                        <div>
                        <label className="block text-xs font-bold text-slate-500 mb-2">Ownership Graph Image URL</label>
                        <input
                            type="text"
                            defaultValue={company.ownershipGraphUrl || ''}
                            id="editGraphUrl"
                            placeholder="https://..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        />
                        </div>
                    </div>
                    </>
                )}
             </>
          )}

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
            <button onClick={onBack} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              Cancel
            </button>
            <button
              onClick={() => {
                const updates: Partial<Company> = {};
                
                // New Entry Fields - Strict & Simple
                if (isNew) {
                    updates.name = (document.getElementById('editName') as HTMLInputElement).value;
                    updates.registryCode = (document.getElementById('editRegCode') as HTMLInputElement).value;
                    updates.legalForm = (document.getElementById('editLegalForm') as HTMLSelectElement).value as LegalForm;
                    updates.registrationDate = (document.getElementById('editRegDate') as HTMLInputElement).value;
                    updates.address = (document.getElementById('editAddress') as HTMLInputElement).value;
                }

                // Only Business can update these fields (Edit Mode)
                if (isBusiness) {
                    updates.contactEmail = (document.getElementById('editEmail') as HTMLInputElement).value;
                    updates.contactPhone = (document.getElementById('editPhone') as HTMLInputElement).value;
                    updates.address = (document.getElementById('editAddress') as HTMLInputElement).value;
                    updates.website = (document.getElementById('editWebsite') as HTMLInputElement).value;
                    updates.businessLogo = logoPreview;
                    updates.managementBoard = tempManagementBoard;
                }

                // Only Admin can update these fields (Edit Mode)
                if (isAdmin && !isNew) {
                  updates.taxDebt = Number((document.getElementById('editTaxDebt') as HTMLInputElement).value);
                  updates.ownershipGraphUrl = (document.getElementById('editGraphUrl') as HTMLInputElement).value;
                }

                onSave(company.id, updates);
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              {isNew ? 'Register Entity' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};