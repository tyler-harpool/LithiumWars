// src/components/game/AbilityAnimation.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { EnhancedAbility } from '@/lib/game/abilitySystem';

interface AbilityAnimationProps {
  ability: EnhancedAbility;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onComplete: () => void;
}

export function AbilityAnimation({
  ability,
  sourcePosition,
  targetPosition,
  onComplete
}: AbilityAnimationProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const particleCount = 20;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: sourcePosition.x,
      y: sourcePosition.y
    }));
    setParticles(newParticles);

    const timer = setTimeout(onComplete, 1000);
    return () => clearTimeout(timer);
  }, [sourcePosition, targetPosition, onComplete]);

  return (
    <AnimatePresence>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute w-2 h-2 rounded-full ${getAbilityColor(ability.effect.type)}`}
          initial={{ x: sourcePosition.x, y: sourcePosition.y, opacity: 1 }}
          animate={{
            x: targetPosition.x + (Math.random() - 0.5) * 50,
            y: targetPosition.y + (Math.random() - 0.5) * 50,
            opacity: 0
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            delay: particle.id * 0.02,
            ease: "easeOut"
          }}
        />
      ))}
    </AnimatePresence>
  );
}

function getAbilityColor(type: string): string {
  switch (type) {
    case 'damage': return 'bg-red-500';
    case 'heal': return 'bg-green-500';
    case 'buff': return 'bg-yellow-500';
    case 'draw': return 'bg-blue-500';
    case 'spawn': return 'bg-purple-500';
    case 'transform': return 'bg-indigo-500';
    default: return 'bg-white';
  }
}
