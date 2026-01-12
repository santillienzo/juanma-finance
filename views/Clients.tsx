import React, { useState } from 'react';
import { FinanceData, AccountType } from '../types';
import { formatARS } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import { Plus, DollarSign, UserPlus, Search } from 'lucide-react';

interface ClientsProps {
  data: FinanceData;
  actions: any;
}

export const Clients: React.FC<ClientsProps> = ({ data, actions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isAddClientOpen, setAddClientOpen] = useState(false);
  const [isSaleOpen, setSaleOpen] = useState(false);
  const [isCollectOpen, setCollectOpen] = useState(false);
  
  // Selection
  const [selectedClient, setSelectedClient] = useState<string>('');

  // Form Data
  const [newClientName, setNewClientName] = useState('');
  const [saleData, setSaleData] = useState({ amount: '', description: '' });
  const [collectData, setCollectData] = useState({ amount: '', toAccount: 'EFECTIVO' as AccountType });

  const filteredClients = data.clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientName.trim()) {
      actions.addClient(newClientName);
      setAddClientOpen(false);
      setNewClientName('');
    }
  };

  const handleSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && saleData.amount) {
      actions.registerSale(selectedClient, Number(saleData.amount), saleData.description);
      setSaleOpen(false);
      setSaleData({ amount: '', description: '' });
    }
  };

  const handleCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedClient && collectData.amount) {
      actions.collectPayment(selectedClient, collectData.toAccount, Number(collectData.amount));
      setCollectOpen(false);
      setCollectData({ amount: '', toAccount: 'EFECTIVO' });
    }
  };

  const openSaleModal = (clientId: string) => {
    setSelectedClient(clientId);
    setSaleOpen(true);
  };

  const openCollectModal = (clientId: string) => {
    setSelectedClient(clientId);
    setCollectOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
        <button 
          onClick={() => setAddClientOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Nuevo Cliente
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar cliente..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-4 font-semibold text-slate-600">Nombre</th>
                <th className="p-4 font-semibold text-slate-600">Saldo (A Cobrar)</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">No hay clientes registrados</td>
                </tr>
              ) : (
                filteredClients.map(client => (
                  <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-800">{client.name}</td>
                    <td className={`p-4 font-bold ${client.balance > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {formatARS(client.balance)}
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button 
                        onClick={() => openSaleModal(client.id)}
                        className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md font-medium transition-colors"
                      >
                        + Venta
                      </button>
                      <button 
                        onClick={() => openCollectModal(client.id)}
                        disabled={client.balance <= 0}
                        className="px-3 py-1.5 text-sm bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cobrar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Client Modal */}
      <Modal isOpen={isAddClientOpen} onClose={() => setAddClientOpen(false)} title="Nuevo Cliente">
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700">
            Guardar
          </button>
        </form>
      </Modal>

      {/* Sale Modal */}
      <Modal isOpen={isSaleOpen} onClose={() => setSaleOpen(false)} title="Registrar Venta">
        <form onSubmit={handleSale} className="space-y-4">
          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            Esto aumentará la deuda del cliente.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto (ARS)</label>
            <input 
              type="number" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={saleData.amount}
              onChange={(e) => setSaleData({ ...saleData, amount: e.target.value })}
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input 
              type="text" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={saleData.description}
              onChange={(e) => setSaleData({ ...saleData, description: e.target.value })}
              placeholder="Ej: Factura A-001"
            />
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700">
            Registrar Venta
          </button>
        </form>
      </Modal>

      {/* Collection Modal */}
      <Modal isOpen={isCollectOpen} onClose={() => setCollectOpen(false)} title="Registrar Cobro">
        <form onSubmit={handleCollection} className="space-y-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800">
            Ingreso de dinero a caja. Disminuye deuda del cliente.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto (ARS)</label>
            <input 
              type="number" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={collectData.amount}
              onChange={(e) => setCollectData({ ...collectData, amount: e.target.value })}
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destino (Entra en)</label>
            <select 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
              value={collectData.toAccount}
              onChange={(e) => setCollectData({ ...collectData, toAccount: e.target.value as AccountType })}
            >
              {data.accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-emerald-700">
            Confirmar Cobro
          </button>
        </form>
      </Modal>
    </div>
  );
};