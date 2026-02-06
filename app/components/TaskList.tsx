"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface Task {
  id: number;
  text: string;
  priority: "low" | "medium" | "high";
}

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: number) => void;
}

export const TaskList = ({ tasks, onDelete }: TaskListProps) => {
  const getLevelStyle = (level: string) => {
    switch (level) {
      case "high":
        return "border-red-500/50 text-red-400 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.1)]";
      case "medium":
        return "border-amber-500/50 text-amber-400 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.1)]";
      default:
        return "border-emerald-500/50 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    }
  };

  const getIcon = (level: string) => {
    switch (level) {
      case "high": return <ShieldAlert size={20} />;
      case "medium": return <Shield size={20} />;
      default: return <ShieldCheck size={20} />;
    }
  };

  return (
    <div className="space-y-4 w-full">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`glass-card p-5 rounded-[1.8rem] flex items-center justify-between border-l-4 transition-all hover:scale-[1.02] ${getLevelStyle(task.priority)}`}
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-900/40 rounded-xl">
                {getIcon(task.priority)}
              </div>
              <div>
                <p className="font-bold text-white text-sm tracking-tight">{task.text}</p>
                <p className="text-[9px] uppercase font-black tracking-[0.2em] opacity-40">
                  {task.priority === "high" ? "Acceso Restringido" : "Encriptado"}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all"
            >
              <Trash2 size={18} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {tasks.length === 0 && (
        <div className="text-center py-10 opacity-20">
          <p className="text-xs font-bold uppercase tracking-widest">Bóveda Vacía</p>
        </div>
      )}
    </div>
  );
};