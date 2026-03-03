import { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function Orders() {
  const { orders, currentUser, refreshOrders } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshOrders();
      toast.success('Orders updated!');
    } catch (error) {
      toast.error('Failed to update orders');
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const checkAndRefresh = () => {
      if (myOrders.some(o => o.smmOrderId && !['Completed', 'Cancelled', 'Rejected', 'Partial', 'Refunded'].includes(o.status))) {
        refreshOrders();
      }
    };

    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'text-emerald-500 bg-emerald-50';
      case 'processing':
      case 'in progress': return 'text-blue-500 bg-blue-50';
      case 'cancelled':
      case 'rejected': return 'text-red-500 bg-red-50';
      case 'partial': return 'text-amber-500 bg-amber-50';
      case 'refunded': return 'text-purple-500 bg-purple-50';
      default: return 'text-orange-500 bg-orange-50';
    }
  };

  return (
    <div className="p-4 space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Order History</h2>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
            <Clock size={32} />
          </div>
          <p className="text-slate-500 font-medium">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-slate-400 mb-1">ID: {order.id}</div>
                  <div className="font-bold text-slate-900 text-sm line-clamp-1">{order.service}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-indigo-600">৳{order.charge.toFixed(2)}</div>
                  <div className={`text-[10px] font-bold px-2 py-1 rounded-md mt-1 inline-block ${getStatusColor(order.status)}`}>
                    {order.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Link:</span>
                  <span className="text-slate-900 font-medium truncate ml-2">{order.link}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="text-slate-900 font-medium">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-slate-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
