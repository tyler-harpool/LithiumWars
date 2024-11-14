// src/components/game/ResourceDisplay.tsx
'use client';

import { motion } from 'framer-motion';
import { Database, Flame } from 'lucide-react';
import { useGameStore } from '@/lib/stores/gameStore';

export function ResourceDisplay() {
  const { primaryResource, secondaryResource } = useGameStore();

  return (
    <motion.div
      className="fixed top-4 right-4 flex gap-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <ResourceCounter
        icon={<Flame className="w-6 h-6 text-orange-400" />}
        value={primaryResource}
        label="Primary"
        color="bg-orange-500"
      />
      <ResourceCounter
        icon={<Database className="w-6 h-6 text-blue-400" />}
        value={secondaryResource}
        label="Secondary"
        color="bg-blue-500"
      />
    </motion.div>
  );
}

interface ResourceCounterProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}

function ResourceCounter({ icon, value, label, color }: ResourceCounterProps) {
  return (
    <motion.div
      className="flex items-center gap-2 bg-slate-800 rounded-lg p-2"
      whileHover={{ scale: 1.05 }}
    >
      {icon}
      <div>
        <div className="text-sm text-slate-400">{label}</div>
        <div className="text-xl font-bold text-white">{value}</div>
      </div>
      <motion.div
        className={`w-1 h-full ${color} rounded-full`}
        initial={{ height: 0 }}
        animate={{ height: '100%' }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
}
