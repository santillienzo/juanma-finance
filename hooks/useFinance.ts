import { useState, useEffect, useCallback } from 'react';
import { FinanceData, INITIAL_ACCOUNTS, AccountType, Transaction, Entity } from '../types';
import { generateId } from '../lib/utils';

const STORAGE_KEY = 'finance_app_v1';

export const useFinance = () => {
  const [data, setData] = useState<FinanceData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      accounts: INITIAL_ACCOUNTS,
      clients: [],
      suppliers: [],
      transactions: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTransaction = (t: Transaction) => {
    setData(prev => ({
      ...prev,
      transactions: [t, ...prev.transactions]
    }));
  };

  // --- ACCOUNTS ---
  const transferInternal = (fromId: AccountType, toId: AccountType, amount: number) => {
    setData(prev => {
      const newAccounts = prev.accounts.map(acc => {
        if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
        return acc;
      });
      return { ...prev, accounts: newAccounts };
    });

    addTransaction({
      id: generateId(),
      date: new Date().toISOString(),
      type: 'TRANSFER',
      amount,
      description: 'Transferencia Interna',
      source: fromId,
      destination: toId
    });
  };

  // --- CLIENTS ---
  const addClient = (name: string) => {
    const newClient: Entity = { id: generateId(), name, balance: 0 };
    setData(prev => ({ ...prev, clients: [...prev.clients, newClient] }));
  };

  const registerSale = (clientId: string, amount: number, description: string) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === clientId ? { ...c, balance: c.balance + amount } : c)
    }));
    const clientName = data.clients.find(c => c.id === clientId)?.name || 'Cliente';
    addTransaction({
      id: generateId(),
      date: new Date().toISOString(),
      type: 'RECEIVABLE_INCREASE',
      amount,
      description: `Venta: ${description}`,
      destination: clientName
    });
  };

  const collectPayment = (clientId: string, accountId: AccountType, amount: number) => {
    setData(prev => ({
      ...prev,
      clients: prev.clients.map(c => c.id === clientId ? { ...c, balance: c.balance - amount } : c),
      accounts: prev.accounts.map(acc => acc.id === accountId ? { ...acc, balance: acc.balance + amount } : acc)
    }));
    const clientName = data.clients.find(c => c.id === clientId)?.name || 'Cliente';
    addTransaction({
      id: generateId(),
      date: new Date().toISOString(),
      type: 'INCOME',
      amount,
      description: 'Cobro a Cliente',
      source: clientName,
      destination: accountId
    });
  };

  // --- SUPPLIERS ---
  const addSupplier = (name: string) => {
    const newSupplier: Entity = { id: generateId(), name, balance: 0 };
    setData(prev => ({ ...prev, suppliers: [...prev.suppliers, newSupplier] }));
  };

  const registerPurchase = (supplierId: string, amount: number, description: string) => {
    setData(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(s => s.id === supplierId ? { ...s, balance: s.balance + amount } : s)
    }));
    const supplierName = data.suppliers.find(s => s.id === supplierId)?.name || 'Proveedor';
    addTransaction({
      id: generateId(),
      date: new Date().toISOString(),
      type: 'DEBT_INCREASE',
      amount,
      description: `Factura: ${description}`,
      source: supplierName
    });
  };

  const paySupplier = (supplierId: string, accountId: AccountType, amount: number) => {
    setData(prev => ({
      ...prev,
      suppliers: prev.suppliers.map(s => s.id === supplierId ? { ...s, balance: s.balance - amount } : s),
      accounts: prev.accounts.map(acc => acc.id === accountId ? { ...acc, balance: acc.balance - amount } : acc)
    }));
    const supplierName = data.suppliers.find(s => s.id === supplierId)?.name || 'Proveedor';
    addTransaction({
      id: generateId(),
      date: new Date().toISOString(),
      type: 'EXPENSE',
      amount,
      description: 'Pago a Proveedor',
      source: accountId,
      destination: supplierName
    });
  };

  return {
    data,
    actions: {
      transferInternal,
      addClient,
      registerSale,
      collectPayment,
      addSupplier,
      registerPurchase,
      paySupplier
    }
  };
};