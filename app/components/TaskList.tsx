"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

type Priority = "low" | "medium" | "high";
type VaultItem = { id: number; text: string; priority: Priority };

export const TaskList = ({
  tasks,
  onDelete,
}: {
  tasks: VaultItem[];
  onDelete: (id: number) => void;
}) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center text-slate-500 font-bold text-xs tracking-widest uppercase py-12">
        Bóveda vacía
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((t) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-4 flex items-start justify-between gap-3"
        >
          <div className="flex gap-3 items-start">
            <span
              className={`mt-1 w-2.5 h-2.5 rounded-full ${
                t.priority === "low"
                  ? "bg-emerald-500"
                  : t.priority === "medium"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            />
            <p className="text-sm font-semibold text-white leading-snug break-words">
              {t.text}
            </p>
          </div>

          <button
            onClick={() => onDelete(t.id)}
            className="p-2 rounded-xl border border-white/5 bg-slate-900/40 text-slate-300 hover:text-red-400 active:scale-90 transition"
            aria-label="Eliminar nota"
          >
            <Trash2 size={16} />
          </button>
        </motion.div>
      ))}
    </div>
  );
};
