'use client';

import { motion } from 'framer-motion';

interface CardEffectsProps {
  type: string;
  rarity?: string;
}

export function CardEffects({ type, rarity = 'common' }: CardEffectsProps) {
  if (rarity === 'legendary') {
    return (
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 animate-glow rounded-3xl" />
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-yellow-500/30"
          animate={{
            boxShadow: ['0 0 10px rgba(234, 179, 8, 0.3)', '0 0 20px rgba(234, 179, 8, 0.6)'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </div>
    );
  }

  if (type === 'spell') {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  return null;
}
