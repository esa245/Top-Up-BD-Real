import { RefreshCw, Clock, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function Orders() {
  const { orders, currentUser } = useAppContext();
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  const handleRefresh = () => {
    toast.success('Orders refreshed!');
  };

  return (
    <div className="p-4 space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Order History</h2>
        <button 
          onClick={handleRefresh}
          className="bg-indigo-50 text-indigo-600 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {myOrders.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
            <Clock size={32} />
          </div>
          <p className="text-gray-500 font-medium">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs text-gray-400 mb-1">ID: {order.id}</div>
                  <div className="font-bold text-gray-900 text-sm line-clamp-1">{order.service}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-indigo-600">৳{order.charge.toFixed(2)}</div>
                  <div className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md mt-1 inline-block">
                    {order.status.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">Link:</span>
                  <span className="text-gray-900 font-medium truncate ml-2">{order.link}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantity:</span>
                  <span className="text-gray-900 font-medium">{order.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span className="text-gray-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
