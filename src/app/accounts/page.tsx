'use client';

import { useState, useEffect } from 'react';
import Table from '../components/table';
import Link from 'next/link';
import Pagination from '../components/Pagination';

interface Payment {
  id: number;
  amount: string;
  paymentMethod: string;
  paymentDate: string;
  accountId: number;
}

interface Account {
  id: number;
  accountName: string;
  balance: number;
  payments: Payment[];
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const columns = [
    { key: 'id', header: '#' },
    { key: 'accountName', header: 'Account Name' },
    {
      key: 'balance',
      header: 'Balance',
      render: (value: number) => <span className="text-blue-600 font-semibold">₹ {value.toFixed(2)}</span>,
    },
    {
      key: 'payments',
      header: 'Transactions',
      render: (value: Payment[]) => (
        <span className={'text-green-600'}>
          {value.length} {value.length >= 1 ? 'txns' : 'txn'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Account) => (
        <span className={'text-green-600'}>
          <Link
            href={`/accounts/${row.id}/edit`}
            className="text-blue-500 hover:underline"
          >
            {'Edit'}
          </Link>
          <span className="mx-2">|</span>
          <Link
            href={`/accounts/${row.id}/payment/create`}
            className="text-blue-500 hover:underline"
          >
            {'Add Payment'}
          </Link>
        </span>
      ),
    },
  ];

  useEffect(() => {
    // add search param in the URL if search is not empty
    const searchParams = new URLSearchParams();
    if(page > 1) {
      searchParams.set('page', page.toString());
    } else {
      searchParams.delete('page');
    }
    fetch(`http://localhost:3000/accounts?${searchParams.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setAccounts(data.data);
        setLastPage(data.lastPage); // from API
        setTotal(data.total);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading accounts...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load accounts: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800"> Accounts </h1>
        <Link
          href={'/accounts/create'}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {'+ Add Account'}
        </Link>
      </div>

      <Table<Account> columns={columns} data={accounts} />
      {/* Pagination Controls */}
      <Pagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />
    </div>
  );
}
