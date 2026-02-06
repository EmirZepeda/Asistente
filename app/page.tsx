"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, ShieldCheck, ShieldAlert, 
  Plus, LogOut, Lock, Unlock, Zap
} from "lucide-react";

// Importación de tus componentes y lógica de seguridad
import { PinPad } from "./components/PinPad";
import { TaskList } from "./components/TaskList";
import { Security } from "@/lib/security";
import { useSession } from "@/hooks/useSession";
import { useBiometrics } from "@/hooks/useBiometrics";

export default function VaultPage() {
  const [status, setStatus] = useState<"locked" | "pin" | "unlocked">("locked");
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const { userProfile } = useSession();
  const { checkBiometrics } = useBiometrics();

  // Carga de datos encriptados al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("vault_pro_data");
    if (saved && status === "unlocked") {
      try {
        const decrypted = Security.decryptData(saved);
        setTasks(decrypted);
      } catch (e) {
        console.error("Error al desencriptar");
      }
    }
  }, [status]);

  const handleInitialAuth = async () => {
    const success = await checkBiometrics();
    if (success) {
      userProfile?.pin ? setStatus("pin") : setStatus("unlocked");
    }
  };

  const handlePinComplete = (inputPin: string) => {
    if (Security.validatePin(inputPin, userProfile?.pin || "")) {
      setStatus("unlocked");
    } else {
      alert("PIN de seguridad incorrecto");
    }
  };

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const updatedTasks = [{ id: Date.now(), text: newTask, priority }, ...tasks];
    setTasks(updatedTasks);
    localStorage.setItem("vault_pro_data", Security.encryptData(updatedTasks));
    setNewTask("");
  };

  const handleDeleteTask = (id: number) => {
    const filtered = tasks.filter(t => t.id !== id);
    setTasks(filtered);
    localStorage.setItem("vault_pro_data", Security.encryptData(filtered));
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-6 flex flex-col items-center selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        
        {/* PANTALLA 1: ACCESO BIOMÉTRICO */}
        {status === "locked" && (
          <motion.div 
            key="locked"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center mt-24 text-center"
          >
            <h1 className="text-5xl font-black tracking-tighter italic mb-2 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
              VAULT.LOCK
            </h1>
            <p className="text-emerald-500/50 text-[10px] tracking-[0.4em] mb-16 font-bold uppercase">
              Biometric + AES-256 Architecture
            </p>
            
            <button 
              onClick={handleInitialAuth}
              className="relative p-12 rounded-[3rem] border border-white/5 bg-slate-900/20 group transition-all hover:border-emerald-500/30"
            >
              <div className="absolute inset-0 rounded-[3rem] bg-emerald-500/5 blur-3xl group-hover:bg-emerald-500/10 transition-all" />
              <Fingerprint size={80} className="text-emerald-500 relative z-10 animate-pulse" strokeWidth={1} />
              <div className="scan-line" /> {/* Definida en globals.css */}
            </button>

            <p className="mt-12 text-slate-500 font-black text-xs tracking-widest uppercase">
              Toca para escanear
            </p>
          </motion.div>
        )}

        {/* PANTALLA 2: SEGUNDO FACTOR (PIN) */}
        {status === "pin" && (
          <motion.div 
            key="pin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-screen w-full"
          >
            <ShieldAlert size={48} className="text-amber-500 mb-6 animate-bounce" />
            <h2 className="text-2xl font-bold mb-10 tracking-tight">PIN de Seguridad</h2>
            <PinPad onComplete={handlePinComplete} />
          </motion.div>
        )}

        {/* PANTALLA 3: BÓVEDA ACTIVA */}
        {status === "unlocked" && (
          <motion.main 
            key="unlocked"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md pb-10"
          >
            <header className="flex justify-between items-center py-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Unlock size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-widest text-white">Bóveda</h2>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">Sesión Activa</p>
                </div>
              </div>
              <button 
                onClick={() => setStatus("locked")}
                className="p-3 bg-slate-900/50 rounded-2xl border border-white/5 text-slate-500 hover:text-red-400 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </header>

            {/* Input de Nueva Nota */}
            <div className="glass-card rounded-[2.5rem] p-5 mb-10">
              <input 
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Escribir nota secreta..."
                className="w-full bg-transparent p-3 outline-none text-white placeholder:text-slate-700 font-semibold"
              />
              <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
                <div className="flex gap-3 px-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button 
                      key={p} 
                      onClick={() => setPriority(p)}
                      className={`w-4 h-4 rounded-full transition-all ${priority === p ? 'ring-4 ring-white/10 scale-125' : 'opacity-30'} ${
                        p === 'low' ? 'bg-emerald-500' : p === 'medium' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={handleAddTask}
                  className="bg-white text-black p-3 rounded-2xl hover:bg-emerald-400 transition-all active:scale-90"
                >
                  <Plus size={24} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Lista de Notas con tu nuevo componente */}
            <TaskList tasks={tasks} onDelete={handleDeleteTask} />
            
          </motion.main>
        )}

      </AnimatePresence>
    </div>
  );
}