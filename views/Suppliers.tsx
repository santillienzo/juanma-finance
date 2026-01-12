import React, { useState } from 'react';
import { FinanceData, AccountType } from '../types';
import { formatARS } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import { UserPlus, Search } from 'lucide-react';

interface SuppliersProps {
  data: FinanceData;
  actions: any;
}

export const Suppliers: React.FC<SuppliersProps> = ({ data, actions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isAddOpen, setAddOpen] = useState(false);
  const [isBillOpen, setBillOpen] = useState(false);
  const [isPayOpen, setPayOpen] = useState(false);
  
  // Selection
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');

  // Form Data
  const [newSupplierName, setNewSupplierName] = useState('');
  const [billData, setBillData] = useState({ amount: '', description: '' });
  const [payData, setPayData] = useState({ amount: '', fromAccount: 'EFECTIVO' as AccountType });

  const filteredSuppliers = data.suppliers.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSupplierName.trim()) {
      actions.addSupplier(newSupplierName);
      setAddOpen(false);
      setNewSupplierName('');
    }
  };

  const handleBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSupplier && billData.amount) {
      actions.registerPurchase(selectedSupplier, Number(billData.amount), billData.description);
      setBillOpen(false);
      setBillData({ amount: '', description: '' });
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSupplier && payData.amount) {
      actions.paySupplier(selectedSupplier, payData.fromAccount, Number(payData.amount));
      setPayOpen(false);
      setPayData({ amount: '', fromAccount: 'EFECTIVO' });
    }
  };

  const openBillModal = (id: string) => {
    setSelectedSupplier(id);
    setBillOpen(true);
  };

  const openPayModal = (id: string) => {
    setSelectedSupplier(id);
    setPayOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Proveedores</h2>
        <button 
          onClick={() => setAddOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
        >
          <UserPlus size={18} />
          Nuevo Proveedor
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar proveedor..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-red-500"
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
                <th className="p-4 font-semibold text-slate-600">Saldo (Deuda)</th>
                <th className="p-4 font-semibold text-slate-600 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">No hay proveedores registrados</td>
                </tr>
              ) : (
                filteredSuppliers.map(s => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-4 font-medium text-slate-800">{s.name}</td>
                    <td className={`p-4 font-bold ${s.balance > 0 ? 'text-red-600' : 'text-slate-400'}`}>
                      {formatARS(s.balance)}
                    </td>
                    <td className="p-4 flex justify-end gap-2">
                      <button 
                        onClick={() => openBillModal(s.id)}
                        className="px-3 py-1.5 text-sm bg-orange-50 text-orange-600 hover:bg-orange-100 rounded-md font-medium transition-colors"
                      >
                        + Factura
                      </button>
                      <button 
                        onClick={() => openPayModal(s.id)}
                        disabled={s.balance <= 0}
                        className="px-3 py-1.5 text-sm bg-red-50 text-red-600 hover:bg-red-100 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Pagar Deuda
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Supplier Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setAddOpen(false)} title="Nuevo Proveedor">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input 
              type="text" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              value={newSupplierName}
              onChange={(e) => setNewSupplierName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700">
            Guardar
          </button>
        </form>
      </Modal>

      {/* Bill Modal (Add Debt) */}
      <Modal isOpen={isBillOpen} onClose={() => setBillOpen(false)} title="Registrar Factura (Deuda)">
        <form onSubmit={handleBill} className="space-y-4">
          <div className="p-3 bg-red-50 rounded-lg text-sm text-red-800">
            Esto aumentará nuestra deuda con el proveedor.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto (ARS)</label>
            <input 
              type="number" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              value={billData.amount}
              onChange={(e) => setBillData({ ...billData, amount: e.target.value })}
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <input 
              type="text" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              value={billData.description}
              onChange={(e) => setBillData({ ...billData, description: e.target.value })}
              placeholder="Ej: Compra de mercadería"
            />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700">
            Registrar Factura
          </button>
        </form>
      </Modal>

      {/* Pay Modal (Reduce Debt) */}
      <Modal isOpen={isPayOpen} onClose={() => setPayOpen(false)} title="Pagar a Proveedor">
        <form onSubmit={handlePayment} className="space-y-4">
          <div className="p-3 bg-orange-50 rounded-lg text-sm text-orange-800">
            Salida de dinero. Reduce deuda y saldo de caja seleccionada.
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Monto a Pagar (ARS)</label>
            <input 
              type="number" 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              value={payData.amount}
              onChange={(e) => setPayData({ ...payData, amount: e.target.value })}
              required
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Origen (Sale de)</label>
            <select 
              className="w-full rounded-lg border-slate-200 border p-2.5 focus:ring-2 focus:ring-red-500 outline-none"
              value={payData.fromAccount}
              onChange={(e) => setPayData({ ...payData, fromAccount: e.target.value as AccountType })}
            >
              {data.accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.label} ({formatARS(acc.balance)})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-red-600 text-white font-medium py-2.5 rounded-lg hover:bg-red-700">
            Confirmar Pago
          </button>
        </form>
      </Modal>
    </div>
  );
};