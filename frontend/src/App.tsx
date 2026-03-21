import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Map as MapIcon, QrCode, User, Send, Navigation, Star, Search, CheckCircle, Camera } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USER_ID = 'mobile-demo-user-123'; // Mock user session

async function apiChat(message: string): Promise<string> {
  try {
    const res = await fetch(`${API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, userId: USER_ID })
    });
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data.reply;
  } catch (e) {
    console.error("Erro API de Chat", e);
    return "Desculpe, o servidor backend Ficaqui está indisponível!";
  }
}

async function apiCheckIn(location: string, coinsEarned: number): Promise<number | null> {
  try {
    const res = await fetch(`${API_URL}/checkin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location, coinsEarned, userId: USER_ID })
    });
    const data = await res.json();
    return data.totalCoins;
  } catch (e) {
    console.error("Erro API Checkin", e);
    return null;
  }
}

async function apiGetBalance(): Promise<number> {
  try {
    const res = await fetch(`${API_URL}/user/${USER_ID}`);
    if (!res.ok) return 150; // default fallback if user missing
    const data = await res.json();
    return data.centroCoins;
  } catch (e) {
    return 150;
  }
}

// ----------------------------------------------------------------------
// TABS COMPONENTS
// ----------------------------------------------------------------------

function ChatTab({ onNavigateRoute }: { onNavigateRoute: () => void }) {
  const [messages, setMessages] = useState<{id: string, text: string, sender: 'user' | 'bot', isRoute?: boolean}[]>([
    { id: '1', text: 'Fala, visse! O que você busca no Centro hoje?', sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newUserMsg = { id: Date.now().toString(), text: userText, sender: 'user' as const };
    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    const apiReply = await apiChat(userText);
    
    setMessages(prev => [
      ...prev, 
      { 
        id: Date.now().toString() + 'bot', 
        text: apiReply, 
        sender: 'bot', 
        isRoute: apiReply.includes('Rota com sombra') || apiReply.includes('panela') 
      }
    ]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50">
      <header className="bg-primary-600 text-white p-4 shadow-md z-10 sticky top-0">
        <h1 className="text-lg font-bold">Ficaqui</h1>
        <p className="text-xs opacity-90">o que você busca, aqui tem!</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        <AnimatePresence initial={false}>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "max-w-[85%] rounded-2xl p-3 shadow-sm",
                msg.sender === 'user' 
                  ? "bg-primary-600 text-white self-end ml-auto rounded-tr-sm" 
                  : "bg-white border border-neutral-100 text-neutral-800 self-start rounded-tl-sm"
              )}
            >
              <p className="text-sm">{msg.text}</p>
              {msg.isRoute && (
                <button 
                  onClick={onNavigateRoute}
                  className="mt-3 w-full bg-secondary-500 hover:bg-secondary-500/90 text-white font-medium py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation size={16} /> Ver Rota
                </button>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white border border-neutral-100 text-neutral-500 self-start rounded-2xl rounded-tl-sm p-3 w-16"
            >
              <div className="flex space-x-1 justify-center">
                <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <div className="absolute bottom-20 left-0 right-0 p-4 bg-gradient-to-t from-neutral-50 via-neutral-50 to-transparent">
        <form onSubmit={handleSend} className="relative flex items-center shadow-lg rounded-full bg-white border border-neutral-100">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite 'panela' ou busque algo..."
            className="w-full bg-transparent outline-none px-6 py-4 text-sm"
          />
          <button 
            type="submit" 
            disabled={!input.trim()}
            className="mr-2 p-2 bg-primary-600 text-white rounded-full disabled:opacity-50 transition-opacity"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function MapTab() {
  return (
    <div className="relative w-full h-full bg-neutral-100 overflow-hidden isolate">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <header className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-neutral-100 to-transparent">
         <div className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3">
           <Search size={18} className="text-neutral-400" />
           <span className="text-sm text-neutral-600">Loja do Seu João</span>
         </div>
      </header>

      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <motion.path
          d="M 50 350 Q 150 250 250 300 T 350 150"
          fill="transparent"
          stroke="#0d9488"
          strokeWidth="4"
          strokeDasharray="8 8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <circle cx="50" cy="350" r="8" fill="#f59e0b" />
        <circle cx="350" cy="150" r="10" fill="#0d9488" />
      </svg>

      <div className="absolute" style={{ top: '350px', left: '25px', zIndex: 2 }}>
        <span className="bg-white text-xs font-bold px-2 py-1 rounded shadow-sm">Você</span>
      </div>

      <div className="absolute" style={{ top: '120px', left: '280px', zIndex: 2 }}>
         <div className="bg-white px-3 py-2 rounded-xl shadow-md flex items-center gap-2">
            <span className="w-3 h-3 bg-primary-600 rounded-full animate-pulse"></span>
            <span className="text-xs font-bold whitespace-nowrap">Loja do Seu João</span>
         </div>
      </div>

      <div className="absolute top-[200px] left-[150px] z-2">
        <div className="flex flex-col items-center">
          <Star size={24} className="text-secondary-500 fill-secondary-500 mb-1" />
          <span className="text-[10px] font-bold text-neutral-600 bg-white/80 px-1 rounded backdrop-blur-sm">Palácio Olímpio Campos</span>
        </div>
      </div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-24 left-4 right-4 bg-white rounded-3xl p-4 shadow-xl border border-neutral-100 flex items-center justify-between z-10"
      >
        <div>
          <h3 className="font-bold text-neutral-800 text-sm">Rota Bioclimática</h3>
          <p className="text-xs text-primary-600 font-medium">+ Sombra e Segurança</p>
          <p className="text-xs text-neutral-500 mt-1">5 min a pé • Plana</p>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center text-primary-600">
          <Navigation size={20} />
        </div>
      </motion.div>
    </div>
  );
}

function QRTab({ onNavigateMap, fetchBalance }: { onNavigateMap: () => void, fetchBalance: () => void }) {
  const [scanned, setScanned] = useState(false);
  const [earned, setEarned] = useState(50);

  const simulateScan = async () => {
    // API Call Checkin backend
    const total = await apiCheckIn('Loja do Seu João', 50);
    setScanned(true);
    if (total !== null) {
      fetchBalance();
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-neutral-900 relative overflow-hidden">
      <AnimatePresence>
        {!scanned ? (
          <motion.div 
            key="scanner"
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center z-10 w-full"
          >
            <h2 className="text-white font-medium mb-8">Posicione o QR Code na área</h2>
            <div className="relative w-64 h-64 border-2 border-dashed border-white/50 rounded-3xl flex items-center justify-center">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-xl"></div>
              <motion.div 
                className="w-full h-1 bg-primary-500 absolute rounded-full shadow-[0_0_15px_#0d9488]"
                animate={{ top: ['0%', '98%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              <Camera size={48} className="text-white/20" />
            </div>

            <button 
              onClick={simulateScan}
              className="mt-12 bg-primary-600 text-white font-semibold py-4 px-8 rounded-full shadow-[0_4px_20px_rgba(13,148,136,0.4)] w-full active:scale-95 transition-transform"
            >
              Simular Leitura
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center z-20 w-full bg-white p-8 rounded-[40px] shadow-2xl"
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[40px]">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: ['#0d9488', '#f59e0b', '#10b981', '#ef4444'][Math.floor(Math.random() * 4)],
                    left: `${Math.random() * 100}%`,
                    top: '50%'
                  }}
                  animate={{
                    top: [`50%`, `${Math.random() * 100}%`],
                    left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 1 + Math.random(), ease: "easeOut" }}
                />
              ))}
            </div>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
              <CheckCircle size={48} className="text-green-500" />
            </motion.div>

            <h2 className="text-2xl font-bold text-neutral-800 mb-2">🎉 Check-in Validado!</h2>
            <p className="text-green-600 font-bold text-4xl mb-8">+{earned} <span className="text-lg">CentroCoins</span></p>

            <button 
              onClick={() => setScanned(false)}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl mb-4 transition-colors"
            >
              Nova Leitura
            </button>
            <button 
              onClick={onNavigateMap}
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-4 rounded-2xl transition-colors"
            >
              Ir para o Mapa
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProfileTab({ balance }: { balance: number }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full h-full bg-neutral-50 overflow-y-auto pb-24">
      <div className="bg-primary-600 pt-12 pb-8 px-6 text-white rounded-b-[40px] shadow-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Olá, Aracajuano!</h2>
            <p className="text-sm opacity-90">Mestre do Centro (Nível 5)</p>
          </div>
        </div>
        
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/20">
          <p className="text-xs font-medium uppercase opacity-80 mb-1">Seu Saldo Total</p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black">{balance}</span>
            <span className="text-sm font-medium pb-1">CentroCoins</span>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-4">
        <h3 className="font-bold text-neutral-800 mb-4">Recompensas em Destaque</h3>
        
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-500/10 rounded-bl-[100px] pointer-events-none"></div>
          <h4 className="font-bold text-lg text-neutral-800">Guitarra Giannini 🎸</h4>
          <p className="text-sm text-neutral-500 mb-4">Loja O Som do Centro</p>
          
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-secondary-500 hover:bg-secondary-600 text-white font-bold py-3 px-6 rounded-xl w-full shadow-[0_4px_15px_rgba(245,158,11,0.3)] transition-colors"
          >
            Simular Compra de Guitarra
          </button>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 isolate">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl z-10 w-full max-w-[450px] mx-auto min-h-[350px] flex flex-col justify-end relative"
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-secondary-500 rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-lg">
                🎸
              </div>
              <div className="text-center mt-6">
                <h2 className="text-2xl font-black text-neutral-800 mb-2">Cultura no Centro!</h2>
                <p className="text-neutral-600 bg-neutral-50 p-4 rounded-2xl mb-6 font-medium">
                  Excelente compra! Hoje às 19h vai rolar um Show de Rock na Praça Fausto Cardoso.
                  <br /><br />
                  <span className="text-primary-600">Resgate 1 cerveja grátis por 30 moedas!</span>
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-4 text-neutral-500 font-bold hover:bg-neutral-50 rounded-xl"
                  >
                    Agora não
                  </button>
                  <button 
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg shadow-primary-600/30"
                  >
                    Resgatar Cerveja
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------------------------------------------------
// MAIN APP COMPONENT
// ----------------------------------------------------------------------

type TabId = 'chat' | 'map' | 'qr' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('chat');
  const [balance, setBalance] = useState(150);

  const fetchBalance = async () => {
    const b = await apiGetBalance();
    setBalance(b);
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const tabs = [
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'map', label: 'Mapa', icon: MapIcon },
    { id: 'qr', label: 'QR Code', icon: QrCode },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <div className="mx-auto max-w-[450px] min-h-[100dvh] h-[100dvh] bg-white shadow-2xl relative flex flex-col overflow-hidden sm:border-x border-neutral-200">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {activeTab === 'chat' && <ChatTab onNavigateRoute={() => setActiveTab('map')} />}
            {activeTab === 'map' && <MapTab />}
            {activeTab === 'qr' && <QRTab onNavigateMap={() => setActiveTab('map')} fetchBalance={fetchBalance} />}
            {activeTab === 'profile' && <ProfileTab balance={balance} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <nav className="bg-white border-t border-neutral-100 flex justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2 relative z-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className="relative flex flex-col items-center p-3 w-20"
            >
              <div className="relative z-10 transition-colors duration-200">
                <Icon size={24} className={isActive ? 'text-primary-600' : 'text-neutral-400'} />
              </div>
              <span className={cn(
                "text-[10px] mt-1 font-medium transition-colors duration-200",
                isActive ? "text-primary-600" : "text-neutral-400"
              )}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-x-2 top-1 bottom-1 bg-primary-50 rounded-2xl z-0"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
