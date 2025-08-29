import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import paymentService from '../../services/paymentService.js';

function Payment() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch payments on component mount
    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.getAllPayments();
            setPayments(response.data.payments || []);
        } catch (error) {
            console.error('Error fetching payments:', error);
            setError(error.message || 'Failed to fetch payments');
            toast.error('Failed to load payments');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async (paymentId) => {
        try {
            await paymentService.updatePaymentStatus(paymentId, 'completed');
            setPayments(prevPayments => 
                prevPayments.map(payment => 
                    payment.payment_id === paymentId 
                        ? { ...payment, status: 'completed', updatedAt: new Date().toISOString() }
                        : payment
                )
            );
            toast.success('Payment confirmed successfully!');
        } catch (error) {
            console.error('Error confirming payment:', error);
            toast.error('Failed to confirm payment');
        }
    };

    const handleRejectPayment = async (paymentId) => {
        try {
            await paymentService.updatePaymentStatus(paymentId, 'failed');
            setPayments(prevPayments => 
                prevPayments.map(payment => 
                    payment.payment_id === paymentId 
                        ? { ...payment, status: 'failed', updatedAt: new Date().toISOString() }
                        : payment
                )
            );
            toast.success('Payment rejected');
        } catch (error) {
            console.error('Error rejecting payment:', error);
            toast.error('Failed to reject payment');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatMethod = (method) => {
        return method.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
                        <p className="text-gray-600">Monitor and manage all payment transactions</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading payments...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
                        <p className="text-gray-600">Monitor and manage all payment transactions</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payments</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button 
                            onClick={fetchPayments}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Management</h1>
                    <p className="text-gray-600">Monitor and manage all payment transactions</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Payment Transactions</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment.payment_id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{payment.order_id}</div>
                                            <div className="text-sm text-gray-500">ID: {payment.payment_id.slice(-8)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">${payment.amount}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatMethod(payment.method)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                getStatusColor(payment.status)
                                            }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {payment.transaction_id || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(payment.createdAt)}</div>
                                            <div className="text-xs text-gray-500">Updated: {formatDate(payment.updatedAt)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {payment.status.toLowerCase() === 'pending' ? (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleConfirmPayment(payment.payment_id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                    >
                                                        ✓ Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectPayment(payment.payment_id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                    >
                                                        ✗ Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">No action needed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">$</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            ${payments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0).toFixed(2)}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">✓</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {payments.filter(p => p.status === 'completed').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">⏳</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {payments.filter(p => p.status === 'pending').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">✗</span>
                                    </div>
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Failed</dt>
                                        <dd className="text-lg font-medium text-gray-900">
                                            {payments.filter(p => p.status === 'failed').length}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment
