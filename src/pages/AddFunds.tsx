import { useState } from 'react';
import { History, Info, Copy } from 'lucide-react';
import { useAppContext } from '../store';
import toast from 'react-hot-toast';

export default function AddFunds() {
  const [selectedMethod, setSelectedMethod] = useState('nagad');
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const { addTransaction, transactions, currentUser, settings } = useAppContext();

  const myTransactions = transactions.filter(t => {
    if (t.userId !== currentUser?.id) return false;
    const txDate = new Date(t.createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return txDate >= sevenDaysAgo;
  });

  const nagadNumber = settings.nagadNumber;
  const bkashNumber = settings.bkashNumber;

  const currentNumber = selectedMethod === 'nagad' ? nagadNumber : bkashNumber;
  const vatRate = 0.35; // 35% VAT
  const parsedAmount = parseFloat(amount) || 0;
  const totalAmountToPay = parsedAmount + (parsedAmount * vatRate);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(currentNumber);
    toast.success('Number copied to clipboard!');
  };

  const handleSubmit = async () => {
    if (parsedAmount < 20) {
      toast.error('সর্বনিম্ন ২০ টাকা অ্যাড করতে পারবেন।');
      return;
    }
    if (!transactionId.trim()) {
      toast.error('অনুগ্রহ করে ট্রানজেকশন আইডি দিন।');
      return;
    }
    
    await addTransaction(parsedAmount, selectedMethod, transactionId);
    setAmount('');
    setTransactionId('');
    toast.success('Transaction submitted successfully! Waiting for admin approval.');
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Add Funds</h2>

      {/* Payment Methods */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setSelectedMethod('nagad')}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
            selectedMethod === 'nagad'
              ? 'border-orange-500 bg-orange-50/10'
              : 'border-slate-100 bg-white hover:border-slate-200'
          }`}
        >
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center mb-3">
            <span className="text-white font-bold text-xs">নগদ</span>
          </div>
          <span className={`font-bold text-sm ${selectedMethod === 'nagad' ? 'text-orange-500' : 'text-slate-600'}`}>
            Nagad
          </span>
        </button>

        <button
          onClick={() => setSelectedMethod('bkash')}
          className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all ${
            selectedMethod === 'bkash'
              ? 'border-pink-500 bg-pink-50/10'
              : 'border-slate-100 bg-white hover:border-slate-200'
          }`}
        >
          <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white" fill="currentColor">
              <path d="M12 2L22 12L12 22L2 12L12 2Z" />
            </svg>
          </div>
          <span className={`font-bold text-sm ${selectedMethod === 'bkash' ? 'text-pink-600' : 'text-slate-600'}`}>
            Bkash
          </span>
        </button>
      </div>

      {/* Amount Input Section */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500">টাকার পরিমাণ (BDT)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="কত টাকা অ্যাড করতে চান?"
            className="w-full bg-white border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          />
          <p className="text-[10px] text-slate-400">সর্বনিম্ন ২০ টাকা</p>
        </div>

        {parsedAmount >= 20 && (
          <div className="bg-indigo-50/50 p-5 rounded-3xl space-y-4 border border-indigo-100 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">অ্যামাউন্ট:</span>
              <span className="font-bold">৳{parsedAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600">ভ্যাট (৩৫%):</span>
              <span className="font-bold">৳{(parsedAmount * vatRate).toFixed(2)}</span>
            </div>
            <div className="h-px bg-indigo-200/50"></div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-indigo-900 font-bold">মোট পেমেন্ট করতে হবে:</span>
              <span className="text-indigo-600 font-extrabold">৳{totalAmountToPay.toFixed(2)}</span>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500">এই নাম্বারে Send Money করুন</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-3 text-center font-mono font-bold text-lg text-slate-800 tracking-wider">
                  {currentNumber}
                </div>
                <button 
                  onClick={handleCopyNumber}
                  className="bg-indigo-100 text-indigo-600 p-3 rounded-2xl hover:bg-indigo-200 transition-colors flex items-center justify-center"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-500">Transaction ID (TrxID)</label>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter Transaction ID"
                className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
              />
            </div>

            <button 
              onClick={handleSubmit}
              className="w-full bg-indigo-600 text-white font-bold text-lg rounded-2xl p-4 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-[0.98] mt-2"
            >
              পেমেন্ট কনফার্ম করুন
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-indigo-50/50 rounded-3xl p-5 space-y-4 border border-indigo-100">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-lg">
          <Info size={20} />
          <span>কীভাবে টাকা অ্যাড করবেন?</span>
        </div>
        <ul className="space-y-3 text-sm text-indigo-800/80">
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
            <span>প্রথমে টাকার পরিমাণ দিন (সর্বনিম্ন ২০ টাকা)।</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
            <span>ভ্যাট (৩৫%) সহ মোট কত টাকা পাঠাতে হবে তা নিচে দেখতে পাবেন।</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
            <span>দেওয়া নাম্বারটি কপি করে আপনার {selectedMethod === 'nagad' ? 'নগদ' : 'বিকাশ'} অ্যাপ থেকে <strong>Send Money</strong> করুন।</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-1.5 shrink-0"></span>
            <span>সফলভাবে টাকা পাঠানোর পর Transaction ID (TrxID) কপি করে এখানে বসিয়ে পেমেন্ট কনফার্ম করুন।</span>
          </li>
        </ul>
      </div>

      {/* Payment History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Payment History (Last 7 Days)</h3>
          <History size={18} className="text-slate-400" />
        </div>

        {myTransactions.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-4">No transactions yet.</div>
        ) : (
          myTransactions.map(tx => (
            <div key={tx.id} className="bg-white border border-slate-200 rounded-3xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${tx.method === 'nagad' ? 'bg-red-500' : 'bg-pink-600'}`}>
                  <span className="text-white font-bold text-[10px]">{tx.method === 'nagad' ? 'নগদ' : 'বিকাশ'}</span>
                </div>
                <div>
                  <div className="font-bold text-slate-900">৳{tx.amount.toFixed(2)}</div>
                  <div className="text-xs text-slate-400">TrxID: {tx.trxId || tx.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-[10px] font-bold px-2 py-1 rounded-md mb-1 inline-block ${
                  tx.status === 'Pending' ? 'text-orange-500 bg-orange-50' :
                  tx.status === 'Approved' ? 'text-emerald-500 bg-emerald-50' :
                  'text-red-500 bg-red-50'
                }`}>
                  {tx.status.toUpperCase()}
                </div>
                <div className="text-[10px] text-slate-400">{new Date(tx.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
