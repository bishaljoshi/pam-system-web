'use client';

import { useState, useEffect } from 'react';

interface Account {
  id?: number;
  accountName: string;
  email: string;
  balance: number;
}

interface AccountFormProps {
  accountId?: string; // optional, for edit mode
  onSuccess?: () => void; // optional callback after submit
}

const AccountForm = ({ accountId, onSuccess }: AccountFormProps) => {
  const [form, setForm] = useState<Account>({
    accountName: '',
    email: '',
    balance: 0,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill form if editing
  const fetchAccount = async () => {
    fetch(`http://localhost:3000/accounts/${accountId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => setForm(data))
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    if (accountId) {
      fetchAccount();
    }
  }, [accountId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'balance' ? parseFloat(value) : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.accountName || !form.email || isNaN(form.balance)) {
      setError('All fields are required and valid.');
      return;
    }

    try {
      const res = await fetch(`http://localhost:3000/accounts${accountId ? `/${accountId}` : ''}`, {
        method: accountId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to save account');

      setSuccess(`Account ${accountId ? 'updated' : 'created'} successfully!`);

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError('An error occurred while saving the account.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4 max-w-md w-full"
    >
      <h2 className="text-xl font-semibold text-gray-800">
        {accountId ? 'Edit Account' : 'Add Account'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
        <input
          type="text"
          name="accountName"
          value={form.accountName}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md text-black"
          placeholder="e.g. John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          disabled={!!accountId} // disable email if editing
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md text-black"
          placeholder="e.g. john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
        <input
          type="number"
          name="balance"
          value={form.balance}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md text-black"
          placeholder="e.g. 1000"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
      >
        {accountId ? 'Update' : 'Add'} Account
      </button>
    </form>
  );
}

export default AccountForm;
