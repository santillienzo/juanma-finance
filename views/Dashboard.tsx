import React from 'react';
import { FinanceData } from '../types';
import { formatARS } from '../lib/utils';
import { Wallet, TrendingUp, TrendingDown, Landmark, PieChart } from 'lucide-react';

interface DashboardProps {
  data: FinanceData;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const totalCash = data.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalReceivables = data.clients.reduce((sum, c) => sum + c.balance, 0);
  const totalPayables = data.suppliers.reduce((sum, s) => sum + s.balance, 0);
  const netWorth = totalCash + totalReceivables - totalPayables;

  const StatCard = ({ title, value, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800">{formatARS(value)}</h3>
        {subText && <p className="text-xs text-slate-400 mt-2">{subText}</p>}
      </div>
      <div className={`p-3 rounded-lg ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Resumen General</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Saldo en Cajas" 
          value={totalCash} 
          icon={Landmark} 
          colorClass="bg-blue-100 text-blue-600"
          subText="Disponible inmediato"
        />
        <StatCard 
          title="A Cobrar (Clientes)" 
          value={totalReceivables} 
          icon={TrendingUp} 
          colorClass="bg-emerald-100 text-emerald-600"
          subText="Ventas pendientes de cobro"
        />
        <StatCard 
          title="A Pagar (Proveedores)" 
          value={totalPayables} 
          icon={TrendingDown} 
          colorClass="bg-red-100 text-red-600"
          subText="Deuda acumulada"
        />
        <StatCard 
          title="Patrimonio Neto" 
          value={netWorth} 
          icon={PieChart} 
          colorClass="bg-violet-100 text-violet-600"
          subText="Cajas + A Cobrar - A Pagar"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Wallet size={20} className="text-slate-500"/> Detalle de Cajas
          </h3>
          <div className="grid gap-4">
            {data.accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${acc.balance >= 0 ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  <span className="font-medium text-slate-700">{acc.label}</span>
                </div>
                <span className="text-lg font-bold text-slate-800">{formatARS(acc.balance)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Estado Financiero</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Activo Corriente</span>
                <span className="font-semibold text-emerald-600">{formatARS(totalCash + totalReceivables)}</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: '100%' }}></div>
             </div>
             
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Pasivo Corriente</span>
                <span className="font-semibold text-red-600">{formatARS(totalPayables)}</span>
             </div>
             <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-red-500 h-full" 
                  style={{ width: `${Math.min(((totalPayables / (totalCash + totalReceivables || 1)) * 100), 100)}%` }}
                ></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};