import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TrendingUp, Clock, Wallet, HeadphonesIcon, User, Download } from "lucide-react";
import { useAppContext } from "../store";

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const { currentUser } = useAppContext();

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 5) {
      setClickCount(0);
      navigate("/admin");
    }
  };

  const navItems = [
    { path: "/new-order", icon: TrendingUp, label: "NEW ORDER" },
    { path: "/orders", icon: Clock, label: "ORDERS" },
    { path: "/add-funds", icon: Wallet, label: "ADD FUNDS" },
    { path: "/support", icon: HeadphonesIcon, label: "SUPPORT" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-gray-900 max-w-md mx-auto shadow-xl relative">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white sticky top-0 z-10">
        <div 
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={handleLogoClick}
        >
          <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Top Up BD</h1>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="https://drive.google.com/file/d/10KEwnLK_pDQ2giM6tsrdsyRyvAXZMj7y/view?usp=drivesdk"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-100 transition-colors"
            title="Download App"
          >
            <Download size={20} />
          </a>
          <div className="text-right">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Balance
            </div>
            <div className="text-sm font-bold text-emerald-500">৳ {currentUser?.balance.toFixed(2) || '0.00'}</div>
          </div>
          <button
            onClick={() => navigate("/profile")}
            className="bg-indigo-50 text-indigo-600 p-2 rounded-xl hover:bg-indigo-100 transition-colors"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-around items-center py-3 px-2 z-20 pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 w-1/4 ${
                isActive
                  ? "text-indigo-600"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-bold tracking-wide">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
