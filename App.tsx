import React, { useState } from 'react';
import { useFinance } from './hooks/useFinance';
import { Dashboard } from './views/Dashboard';
import { Accounts } from './views/Accounts';
import { Clients } from './views/Clients';
import { Suppliers } from './views/Suppliers';
import { History } from './views/History';
import { 
  LayoutDashboard, 
  Wallet, 
  Users, 
  Truck, 
  History as HistoryIcon, 
  Menu, 
  X 
} from 'lucide-react';

type View = 'DASHBOARD' | 'ACCOUNTS' | 'CLIENTS' | 'SUPPLIERS' | 'HISTORY';

export default function App() {
  const { data, actions } = useFinance();
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'DASHBOARD', label: 'Inicio', icon: LayoutDashboard },
    { id: 'ACCOUNTS', label: 'Cajas', icon: Wallet },
    { id: 'CLIENTS', label: 'Clientes', icon: Users },
    { id: 'SUPPLIERS', label: 'Proveedores', icon: Truck },
    { id: 'HISTORY', label: 'Movimientos', icon: HistoryIcon },
  ];

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard data={data} />;
      case 'ACCOUNTS': return <Accounts data={data} actions={actions} />;
      case 'CLIENTS': return <Clients data={data} actions={actions} />;
      case 'SUPPLIERS': return <Suppliers data={data} actions={actions} />;
      case 'HISTORY': return <History data={data} />;
      default: return <Dashboard data={data} />;
    }
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-slate-700/50">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="bg-blue-600 text-white p-1 rounded">FA</span> Finanzas ARS
        </h1>
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => {
              setCurrentView(item.id as View);
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
              ${currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile Header & Sidebar Overlay */}
      <div className="lg:hidden fixed w-full z-40">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
           <h1 className="font-bold">Finanzas ARS</h1>
           <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
             {isSidebarOpen ? <X /> : <Menu />}
           </button>
        </div>
        
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}>
            <div 
              className="absolute left-0 top-0 h-full w-64 bg-slate-900 shadow-xl z-50"
              onClick={e => e.stopPropagation()}
            >
              <NavContent />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
}