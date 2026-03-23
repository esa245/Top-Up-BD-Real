import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { ref, onValue, set, update, get, child } from 'firebase/database';
import axios from 'axios';

export type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';
export type OrderStatus = 'Pending' | 'Processing' | 'Completed' | 'Cancelled' | 'Partial' | 'Refunded';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  whatsapp: string;
  password?: string;
  balance: number;
  totalSpent: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  method: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
  trxId?: string;
}

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  service: string;
  link: string;
  quantity: number;
  charge: number;
  status: OrderStatus;
  createdAt: string;
  smmOrderId?: string;
}

export interface ReferralClaim {
  id: string;
  referrerId: string;
  referrerEmail: string;
  referredUserIdOrEmail: string;
  status: TransactionStatus;
  createdAt: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  transactions: Transaction[];
  orders: Order[];
  referralClaims: ReferralClaim[];
  settings: { nagadNumber: string; bkashNumber: string };
  login: (email: string, name?: string, password?: string, userId?: string, username?: string, whatsapp?: string) => Promise<void>;
  logout: () => void;
  addTransaction: (amount: number, method: string, trxId?: string) => Promise<void>;
  approveTransaction: (id: string) => Promise<void>;
  rejectTransaction: (id: string) => Promise<void>;
  placeOrder: (service: string, link: string, quantity: number, charge: number, smmOrderId?: string) => Promise<boolean>;
  refreshOrders: () => Promise<void>;
  updateSettings: (nagad: string, bkash: string) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => Promise<void>;
  addReferralClaim: (referredUserIdOrEmail: string) => Promise<{ success: boolean; message: string }>;
  approveReferralClaim: (id: string, amount: number) => Promise<void>;
  rejectReferralClaim: (id: string) => Promise<void>;
  updateUserBalance: (userId: string, newBalance: number) => Promise<void>;
  restoreData: (data: any) => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('backup_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('backup_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('backup_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [referralClaims, setReferralClaims] = useState<ReferralClaim[]>(() => {
    const saved = localStorage.getItem('backup_referralClaims');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('backup_settings');
    return saved ? JSON.parse(saved) : { nagadNumber: '01792157184', bkashNumber: '01753567152' };
  });

  useEffect(() => {
    const usersRef = ref(db, 'users');
    const txsRef = ref(db, 'transactions');
    const ordersRef = ref(db, 'orders');
    const referralsRef = ref(db, 'referralClaims');
    const settingsRef = ref(db, 'settings');

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.values(data) as User[];
        setUsers(usersList);
        localStorage.setItem('backup_users', JSON.stringify(usersList));
        // Sync currentUser if it exists
        if (currentUser) {
          const updatedMe = usersList.find(u => u.id === currentUser.id);
          if (updatedMe) setCurrentUser(updatedMe);
        }
      } else {
        setUsers([]);
        localStorage.removeItem('backup_users');
      }
    });

    const unsubscribeTxs = onValue(txsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? (Object.values(data) as Transaction[]).reverse() : [];
      setTransactions(list);
      localStorage.setItem('backup_transactions', JSON.stringify(list));
    });

    const unsubscribeOrders = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? (Object.values(data) as Order[]).reverse() : [];
      setOrders(list);
      localStorage.setItem('backup_orders', JSON.stringify(list));
    });

    const unsubscribeReferrals = onValue(referralsRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? (Object.values(data) as ReferralClaim[]).reverse() : [];
      setReferralClaims(list);
      localStorage.setItem('backup_referralClaims', JSON.stringify(list));
    });

    const unsubscribeSettings = onValue(settingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSettings(data);
        localStorage.setItem('backup_settings', JSON.stringify(data));
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeTxs();
      unsubscribeOrders();
      unsubscribeReferrals();
      unsubscribeSettings();
    };
  }, [currentUser?.id]);

  useEffect(() => { 
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = async (email: string, name?: string, password?: string, userId?: string, username?: string, whatsapp?: string) => {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    const allUsers = snapshot.val() ? (Object.values(snapshot.val()) as User[]) : [];
    
    let user = allUsers.find(u => u.email === email);
    if (!user) {
      const newUserId = userId || Math.random().toString(36).substr(2, 9);
      user = {
        id: newUserId,
        name: name || email.split('@')[0],
        username: username || email.split('@')[0],
        email,
        whatsapp: whatsapp || '',
        password,
        balance: 2, // Signup bonus
        totalSpent: 0,
        createdAt: new Date().toISOString()
      };
      await set(ref(db, `users/${newUserId}`), user);
    }
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const addTransaction = async (amount: number, method: string, trxId?: string) => {
    if (!currentUser) return;
    const txId = Math.random().toString(36).substr(2, 9);
    const newTx: Transaction = {
      id: txId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      method,
      amount,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      trxId
    };
    await set(ref(db, `transactions/${txId}`), newTx);
  };

  const approveTransaction = async (id: string) => {
    const txRef = ref(db, `transactions/${id}`);
    const txSnap = await get(txRef);
    const tx = txSnap.val() as Transaction;
    
    if (!tx || tx.status !== 'Pending') return;

    await update(txRef, { status: 'Approved' });
    
    const userRef = ref(db, `users/${tx.userId}`);
    const userSnap = await get(userRef);
    const user = userSnap.val() as User;
    
    if (user) {
      await update(userRef, { balance: user.balance + tx.amount });
    }
  };

  const rejectTransaction = async (id: string) => {
    await update(ref(db, `transactions/${id}`), { status: 'Rejected' });
  };

  const placeOrder = async (service: string, link: string, quantity: number, charge: number, smmOrderId?: string) => {
    if (!currentUser || currentUser.balance < charge) return false;
    
    const orderId = Math.random().toString(36).substr(2, 9);
    const newOrder: Order = {
      id: orderId,
      userId: currentUser.id,
      userEmail: currentUser.email,
      service,
      link,
      quantity,
      charge,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      smmOrderId
    };

    await set(ref(db, `orders/${orderId}`), newOrder);
    
    const userRef = ref(db, `users/${currentUser.id}`);
    await update(userRef, { 
      balance: currentUser.balance - charge, 
      totalSpent: currentUser.totalSpent + charge 
    });
    
    return true;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    const orderRef = ref(db, `orders/${orderId}`);
    const orderSnap = await get(orderRef);
    const order = orderSnap.val() as Order;

    if (!order || order.status === newStatus) return;

    const oldStatus = order.status;
    await update(orderRef, { status: newStatus });

    // Refund logic: if moving TO Cancelled/Refunded FROM a non-refunded state
    const isRefundStatus = (s: OrderStatus) => s === 'Cancelled' || s === 'Refunded';
    
    if (isRefundStatus(newStatus) && !isRefundStatus(oldStatus)) {
      const userRef = ref(db, `users/${order.userId}`);
      const userSnap = await get(userRef);
      const user = userSnap.val() as User;
      
      if (user) {
        await update(userRef, { 
          balance: user.balance + order.charge,
          totalSpent: Math.max(0, user.totalSpent - order.charge)
        });
      }
    }
  };

  const refreshOrders = async () => {
    if (!currentUser) return;
    
    const userOrders = orders.filter(o => o.userId === currentUser.id);
    const pendingOrders = userOrders.filter(o => 
      o.smmOrderId && 
      !['Completed', 'Cancelled', 'Rejected', 'Partial', 'Refunded'].includes(o.status)
    );

    if (pendingOrders.length === 0) return;

    for (const order of pendingOrders) {
      try {
        // Add a small delay between requests to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await axios.get(`/api/status/${order.smmOrderId}`);
        const data = response.data;
        
        if (data && data.status) {
          let newStatus: OrderStatus = order.status;
          const smmStatus = data.status.toLowerCase();
          
          if (smmStatus.includes('pending')) newStatus = 'Pending';
          else if (smmStatus.includes('processing') || smmStatus.includes('progress')) newStatus = 'Processing';
          else if (smmStatus.includes('completed')) newStatus = 'Completed';
          else if (smmStatus.includes('canceled') || smmStatus.includes('cancelled')) newStatus = 'Cancelled';
          else if (smmStatus.includes('partial')) newStatus = 'Partial';
          else if (smmStatus.includes('refund')) newStatus = 'Refunded';
          
          if (newStatus !== order.status) {
            await updateOrderStatus(order.id, newStatus);
          }
        }
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || error;
        console.error(`Failed to refresh order ${order.id}:`, errorMessage);
      }
    }
  };

  const updateSettings = async (nagad: string, bkash: string) => {
    await set(ref(db, 'settings'), { nagadNumber: nagad, bkashNumber: bkash });
  };

  const addReferralClaim = async (referredUserIdOrEmail: string) => {
    if (!currentUser) return { success: false, message: 'User not logged in' };
    
    const cleanId = referredUserIdOrEmail.trim();
    
    const snapshot = await get(ref(db, 'referralClaims'));
    const allClaims = snapshot.val() ? (Object.values(snapshot.val()) as ReferralClaim[]) : [];
    
    const existing = allClaims.find(c => 
      c.referrerId === currentUser.id && 
      c.referredUserIdOrEmail === cleanId
    );
    
    if (existing) {
      return { success: false, message: 'এই আইডিটি আপনি আগেই ব্যবহার করেছেন।' };
    }

    const usersSnap = await get(ref(db, 'users'));
    const allUsers = usersSnap.val() ? (Object.values(usersSnap.val()) as User[]) : [];
    const referredUser = allUsers.find(u => u.id === cleanId || u.email === cleanId);
    
    const claimId = Math.random().toString(36).substr(2, 9);
    const newClaim: ReferralClaim = {
      id: claimId,
      referrerId: currentUser.id,
      referrerEmail: currentUser.email,
      referredUserIdOrEmail: cleanId,
      status: referredUser ? 'Approved' : 'Pending',
      createdAt: new Date().toISOString()
    };

    await set(ref(db, `referralClaims/${claimId}`), newClaim);

    if (referredUser) {
      const rewardAmount = 5;
      const userRef = ref(db, `users/${currentUser.id}`);
      await update(userRef, { balance: currentUser.balance + rewardAmount });
      return { success: true, message: `সফল হয়েছে! আপনার ব্যালেন্সে ৳${rewardAmount} যোগ করা হয়েছে।` };
    }

    return { success: true, message: 'Referral submitted! Waiting for user to join or admin check.' };
  };

  const approveReferralClaim = async (id: string, amount: number) => {
    const claimRef = ref(db, `referralClaims/${id}`);
    const claimSnap = await get(claimRef);
    const claim = claimSnap.val() as ReferralClaim;
    
    if (!claim || claim.status !== 'Pending') return;

    await update(claimRef, { status: 'Approved' });
    
    const userRef = ref(db, `users/${claim.referrerId}`);
    const userSnap = await get(userRef);
    const user = userSnap.val() as User;
    
    if (user) {
      await update(userRef, { balance: user.balance + amount });
    }
  };

  const rejectReferralClaim = async (id: string) => {
    await update(ref(db, `referralClaims/${id}`), { status: 'Rejected' });
  };

  const updateUserBalance = async (userId: string, newBalance: number) => {
    const userRef = ref(db, `users/${userId}`);
    await update(userRef, { balance: newBalance });
  };

  const restoreData = async (data: any) => {
    if (!data) return;
    if (data.users) await set(ref(db, 'users'), data.users);
    if (data.transactions) await set(ref(db, 'transactions'), data.transactions);
    if (data.orders) await set(ref(db, 'orders'), data.orders);
    if (data.referralClaims) await set(ref(db, 'referralClaims'), data.referralClaims);
  };

  return (
    <AppContext.Provider value={{ currentUser, users, transactions, orders, referralClaims, settings, login, logout, addTransaction, approveTransaction, rejectTransaction, placeOrder, refreshOrders, updateSettings, updateOrderStatus, addReferralClaim, approveReferralClaim, rejectReferralClaim, updateUserBalance, restoreData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
