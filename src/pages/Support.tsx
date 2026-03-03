import React from "react";
import { HeadphonesIcon, Send, MessageCircle, Mail, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

export default function Support() {
  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("im.softwark.team@gmail.com");
    toast.success("Email copied to clipboard!");
    window.location.href = "mailto:im.softwark.team@gmail.com";
  };

  return (
    <div className="p-4 space-y-8 flex flex-col items-center text-center pt-8 pb-24">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-200 blur-2xl rounded-full opacity-50"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-50 to-white rounded-full flex items-center justify-center text-indigo-600 mb-4 shadow-xl border border-white">
          <HeadphonesIcon size={40} className="drop-shadow-sm" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-indigo-600">
          Need Help?
        </h2>
        <p className="text-slate-500 text-sm px-4 leading-relaxed">
          Our support team is highly responsive and available 24/7 to assist you with your orders or payments.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full space-y-4 mt-4">
        <a 
          href="https://t.me/topupbd1103"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full group relative overflow-hidden bg-gradient-to-r from-[#0088cc] to-[#00a2f2] text-white font-bold rounded-2xl p-4 flex items-center justify-between hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl">
              <Send size={24} />
            </div>
            <span className="text-lg">Contact on Telegram</span>
          </div>
          <ExternalLink size={20} className="opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
        </a>

        <a 
          href="https://chat.whatsapp.com/JMVX7Q5csQ886JzYxqCIBs"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full group relative overflow-hidden bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold rounded-2xl p-4 flex items-center justify-between hover:shadow-lg hover:shadow-green-200 transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-white/20 p-2 rounded-xl">
              <MessageCircle size={24} />
            </div>
            <span className="text-lg">Join WhatsApp Group</span>
          </div>
          <ExternalLink size={20} className="opacity-50 group-hover:opacity-100 transition-opacity relative z-10" />
        </a>
      </div>

      {/* Email Section */}
      <div className="w-full space-y-3 pt-6">
        <div className="flex items-center justify-center gap-2">
          <div className="h-px bg-slate-200 flex-1"></div>
          <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Or email us directly</h3>
          <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <a 
          href="mailto:im.softwark.team@gmail.com"
          onClick={handleCopyEmail}
          className="w-full group bg-white border-2 border-slate-100 rounded-3xl p-5 flex flex-col items-center justify-center gap-2 text-slate-700 font-medium cursor-pointer hover:border-indigo-100 hover:bg-indigo-50/50 transition-all shadow-sm"
        >
          <div className="bg-slate-50 group-hover:bg-indigo-100 p-3 rounded-full transition-colors">
            <Mail size={24} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
          </div>
          <span className="text-slate-900 font-bold">im.softwark.team@gmail.com</span>
          <span className="text-[10px] text-slate-400">Tap to copy & open mail app</span>
        </a>
      </div>

      {/* Community Banner */}
      <div className="w-full bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-left mt-8 relative overflow-hidden shadow-xl shadow-indigo-200">
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-1">
            <div className="text-indigo-200 text-[10px] font-bold tracking-widest uppercase">
              Join Community
            </div>
            <div className="text-white font-bold text-xl">
              Get latest updates
            </div>
          </div>
          <a 
            href="https://t.me/topupbd1103"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-indigo-600 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-indigo-50 transition-colors shadow-md active:scale-95"
          >
            Join Now
          </a>
        </div>
        {/* Decorative background circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-purple-400 rounded-full opacity-20 blur-xl"></div>
      </div>
    </div>
  );
}
