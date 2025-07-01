'use client';

import { useEffect, useState } from 'react';

interface PaymentFormProps {
  accountId: string;
  paymentId?: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ accountId, paymentId, onSuccess }: PaymentFormProps) {
  const [form, setForm] = useState({
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'CASH',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Pre-fill form if editing
  const fetchPayment = async () => {
    fetch(`http://localhost:3000/payments/${paymentId}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        console.log('Fetched payment data:', data);
        data = {
          ...data,
          paymentDate: data.paymentDate.split('T')[0]
        }
        setForm(data)
      })
      .catch(err => setError(err.message));
  };

  useEffect(() => {
    if (paymentId) {
      fetchPayment();
    }
  }, [paymentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log({ name, value })
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.amount || !form.paymentDate || !form.paymentMethod) {
      setError('All fields are required.');
      return;
    }

    const body = {
      amount: parseFloat(form.amount),
      payment_date: form.paymentDate,
      payment_method: form.paymentMethod,
      account_id: Number(accountId),
    };

    try {
      const res = await fetch(`http://localhost:3000/payments${paymentId ? `/${paymentId}` : ''}`, {
        method: paymentId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error('Failed to save payment');

      setSuccess(paymentId ? 'Payment updated!' : 'Payment added!');

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setError('An error occurred while saving the payment.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow space-y-4 max-w-md w-full"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {paymentId ? 'Edit Payment' : 'Add Payment'}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md text-black"
          placeholder="Enter amount"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
        <input
          type="date"
          name="paymentDate"
          value={form.paymentDate}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md text-black"
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition cursor-pointer"
      >
        {paymentId ? 'Update Payment' : 'Add Payment'}
      </button>
    </form>
  );
}
