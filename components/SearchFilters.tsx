import React from 'react';
import { LegalForm } from '../types';
import { Filter, Calendar, Briefcase } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedForm: string;
  setSelectedForm: (s: string) => void;
  dateFrom: string;
  setDateFrom: (s: string) => void;
}

export const SearchFilters: React.FC<Props> = ({
  searchTerm, setSearchTerm,
  selectedForm, setSelectedForm,
  dateFrom, setDateFrom
}) => {
  return (
    <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 animate-fade-in-up relative z-20">
      <div className="flex items-center gap-3 mb-6 text-blue-900 border-b border-blue-100 pb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Filter className="w-5 h-5 text-blue-700" />
        </div>
        <h2 className="font-bold text-lg font-serif">Refine Registry Search</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Legal Form */}
        <div className="space-y-2 group">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-700 transition-colors">
            <Briefcase className="w-3 h-3" /> Legal Form
          </label>
          <div className="relative">
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm transition-all hover:bg-white hover:shadow-sm appearance-none font-medium"
            >
              <option value="">All Legal Forms</option>
              {Object.values(LegalForm).map((form) => (
                <option key={form} value={form}>{form}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Registration Date */}
        <div className="space-y-2 group">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-blue-700 transition-colors">
             <Calendar className="w-3 h-3" /> Registered After
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm transition-all hover:bg-white hover:shadow-sm font-medium text-slate-600"
          />
        </div>
      </div>
    </div>
  );
};