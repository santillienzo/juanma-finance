import React from 'react';
import { FinanceData, Transaction } from '../types';
import { formatARS, formatDate } from '../lib/utils';
import { ArrowRight, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

interface HistoryProps {
  data: FinanceData;
}

export const History: React.FC<HistoryProps> = ({ data }) => {
  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'INCOME': return <ArrowDownLeft className="text-emerald-500" />;
      case 'EXPENSE': return <ArrowUpRight className="text-red-500" />;
      case 'TRANSFER': return <ArrowRight className="text-blue-500" />;
      case 'DEBT_INCREASE': return <ArrowUpRight className="text-orange-500" />;
      case 'RECEIVABLE_INCREASE': return <ArrowRight className="text-blue-400" />;
      default: return <ArrowRight className="text-slate-400" />;
    }
  };

  const getLabel = (t: Transaction) => {
    switch (t.type) {
        case 'TRANSFER': return 'Transferencia Interna';
        case 'INCOME': return 'Cobro';
        case 'EXPENSE': return 'Pago';
        case 'DEBT_INCREASE': return 'Factura Recibida';
        case 'RECEIVABLE_INCREASE': return 'Venta Realizada';
        default: return 'Movimiento';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Historial de Movimientos</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500">
                <th className="p-4 font-medium">Fecha</th>
                <th className="p-4 font-medium">Tipo</th>
                <th className="p-4 font-medium">Descripción</th>
                <th className="p-4 font-medium">Origen</th>
                <th className="p-4 font-medium">Destino</th>
                <th className="p-4 font-medium text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">No hay movimientos registrados</td>
                </tr>
              ) : (
                data.transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/50">
                    <td className="p-4 text-slate-500 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="p-4 font-medium text-slate-700 flex items-center gap-2">
                      {getIcon(t.type)} {getLabel(t)}
                    </td>
                    <td className="p-4 text-slate-600">{t.description}</td>
                    <td className="p-4 text-slate-600">{t.source || '-'}</td>
                    <td className="p-4 text-slate-600">{t.destination || '-'}</td>
                    <td className="p-4 text-right font-bold text-slate-800">{formatARS(t.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};