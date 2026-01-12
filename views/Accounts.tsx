import React, { useState } from 'react';
import { FinanceData, AccountType } from '../types';
import { formatARS } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import { ArrowRightLeft, CreditCard, Banknote, Building2 } from 'lucide-react';

interface AccountsProps {
  data: FinanceData;
  actions: any;
}

export const Accounts: React.FC<AccountsProps> = ({ data, actions }) => {
  const [isTransferModalOpen, setTransferModalOpen] = useState(false);
  const [transferData, setTransferData] = useState({
    from: 'EFECTIVO' as AccountType,
    to: 'CHEQUES' as AccountType,
    amount: ''
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferData.amount || Number(transferData.amount) <= 0) return;
    if (transferData.from === transferData.to) return;

    actions.transferInternal(transferData.from, transferData.to, Number(transferData.amount));
    setTransferModalOpen(false);
    setTransferData({ ...transferData, amount: '' });
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'EFECTIVO': return <Banknote className="text-green-600" size={32} />;
      case 'CHEQUES': return <CreditCard className="text-blue-600" size={32} />;
      default: return <Building2 className="text-violet-600" size={32} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Mis Cajas</h2>
        <button 
          onClick={() => setTransferModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <ArrowRightLeft size={18} />
          Transferencia Interna
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.accounts.map(acc => (
          <div key={acc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
            <div className="p-4 bg-slate-50 rounded-full">
              {getIcon(acc.id)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700">{acc.label}</h3>
              <p className="text-3xl font-bold text-slate-900 mt-2">{formatARS(acc.balance)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Internal Transfer Modal */}
      <Modal 
        isOpen={isTransferModalOpen} 
        onClose={() => setTransferModalOpen(false)}
        title="Transferencia entre Cajas"
      >
        <form onSubmit={handleTransfer} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Origen</label>
            <select 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={transferData.from}
              onChange={(e) => setTransferData({ ...transferData, from: e.target.value as AccountType })}
            >
              {data.accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.label} ({formatARS(acc.balance)})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <ArrowRightLeft className="text-slate-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destino</label>
            <select 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              value={transferData.to}
              onChange={(e) => setTransferData({ ...transferData, to: e.target.value as AccountType })}
            >
              {data.accounts.map(acc => (
                <option key={acc.id} value={acc.id} disabled={acc.id === transferData.from}>
                  {acc.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto (ARS)</label>
            <input 
              type="number" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="0.00"
              min="1"
              step="0.01"
              value={transferData.amount}
              onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Confirmar Transferencia
          </button>
        </form>
      </Modal>
    </div>
  );
};