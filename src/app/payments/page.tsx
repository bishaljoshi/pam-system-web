'use client';

import { useState, useEffect } from 'react';
import Table from '../components/table';
import Link from 'next/link';
import Pagination from '../components/Pagination';

interface Payment {
  accountName: string;
  id: number;
  account: Payment;
  amount: number;
  payment_date: string;
  payment_methd: string;
}

export default function PaymentsPage() {
  const [search, setSearch] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const columns = [
    { key: 'id', header: '#' },
    {
      key: 'account',
      header: 'Account Name',
      render: (_: unknown, row: Payment) => <span>{row.account?.accountName || '—'}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (value: number) => <span className="text-blue-600 font-semibold">₹ {value}</span>,
    },
    {
      key: 'paymentDate',
      header: 'Payment Date',
      render: (value: string) => {
        const date = new Date(value);
        const formatted = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        return <span>{formatted}</span>;
      },
    },
    { key: 'paymentMethod', header: 'Payment Method' },
    {
      key: 'actions',
      header: 'Actions',
      render: (_: unknown, row: Payment) => (
        <span className={'text-green-600'}>
          <Link
            href={`/payments/${row.id}/edit`}
            className="text-blue-500 hover:underline"
          >
            {'Edit'}
          </Link>
          <span className="mx-2">|</span>
          {/* <Link
            href={`/payments/${row.id}/delete`}
            className="text-blue-500 hover:underline"
          >
            {'Delete'}
          </Link> */}
          <button
            onClick={async () => {
              const confirmDelete = confirm('Are you sure you want to delete this payment?');
              if (!confirmDelete) return;

              try {
                const res = await fetch(`http://localhost:3000/payments/${row.id}`, {
                  method: 'DELETE',
                });

                if (!res.ok) {
                  throw new Error('Failed to delete');
                }

                alert('Payment deleted successfully');
                // refresh the page and reset the total count
                // instead of refreshing, we can just remove it from the state
                setPayments(payments.filter(p => p.id !== row.id));
                setTotal(total - 1);
              } catch (err) {
                alert('Error deleting payment');
                console.error(err);
              }
            }}
            className="text-red-500 hover:underline cursor-pointer"
          >
            Delete
          </button>
        </span>
      ),
    },
  ];

  useEffect(() => {
    // add search param in the URL if search is not empty
    const searchParams = new URLSearchParams();
    if (search.length > 2) {
      searchParams.set('search', search);
    } else {
      searchParams.delete('search');
    }
    if(page > 1) {
      searchParams.set('page', page.toString());
    } else {
      searchParams.delete('page');
    }
    // fetch payments from API
    fetch(`http://localhost:3000/payments?${searchParams.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => { 
        setPayments(data.data);
        setLastPage(data.lastPage); // from API
        setTotal(data.total);
       })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, page]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading payments...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load payments: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
        <input
          type="text"
          placeholder="Search by account..."
          className="border border-gray-300 rounded-lg px-4 py-2 text-black"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            // setPage(1); // reset to page 1 on search
          }}
        />
      </div>

      <Table<Payment> columns={columns} data={payments} />
      {/* Pagination Controls */}
      <Pagination page={page} lastPage={lastPage} total={total} onPageChange={setPage} />
    </div>
  );
}
