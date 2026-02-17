// components/PinPad.tsx
import { motion } from "framer-motion";
import { useState } from "react";

export const PinPad = ({ onComplete }: { onComplete: (pin: string) => void }) => {
  const [digits, setDigits] = (useState(""));

  const addDigit = (n: string) => {
    if (digits.length < 4) {
      const newDigits = digits + n;
      setDigits(newDigits);
      if (newDigits.length === 4) onComplete(newDigits);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4 mb-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full ${digits.length > i ? 'bg-green-500' : 'bg-slate-700'}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "Del"].map((val) => (
          <button 
            key={val}
            onClick={() => val === "C" ? setDigits("") : addDigit(val)}
            className="w-16 h-16 rounded-full bg-slate-800 text-white font-bold text-xl active:bg-green-500/20"
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  );
};