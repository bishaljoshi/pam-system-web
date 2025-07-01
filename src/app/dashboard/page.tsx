'use client';

import { useEffect, useState } from "react";
import Table from "../components/table";
import Card from "../components/card";

interface Account {
  id: number;
  name: string;
  balance: number;
}

interface Payment {
  accountName: string;
  id: number;
  account: Payment;
  amount: number;
  payment_date: string;
  payment_methd: string;
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const columns = [
    { key: 'id', header: '#' },
    {
      key: 'account',
      header: 'Account Name',
      render: (_: unknown, row: Payment) => <span>{row.account?.accountName || '—'}</span>,
    },
    { key: 'amount', header: 'Amount' },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (value: string) => {
        const date = new Date(value);
        const formatted = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        return <span>{formatted}</span>;
      },
    },
    { key: 'paymentMethod', header: 'Payment Method' }
  ];

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3000/accounts').then((res) => res.json()),
      fetch('http://localhost:3000/payments').then((res) => res.json()),
    ])
      .then(([accountsData, paymentsData]) => {
        setAccounts(accountsData.data);
        setPayments(paymentsData.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const totalAccounts = accounts.length;
  const totalPayments = payments.length;
  const totalAmountPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load dashboard data: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card title="Total Accounts" value={totalAccounts} color="blue"/>
        <Card title="Total Payments" value={totalPayments} color="green"/>
        <Card title="Total Paid" value={totalAmountPaid} color="purple" />
      </div>
      
      {/* Payments Table */}
      <Table<Payment> columns={columns} data={payments} />
    </div>
  );
}
