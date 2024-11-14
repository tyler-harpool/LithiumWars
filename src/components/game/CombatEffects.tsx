'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';

interface CombatEffectProps {
  type: 'attack' | 'defense' | 'special';
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onComplete: () => void;
}

export function CombatEffect({ type, sourcePosition, targetPosition, onComplete }: CombatEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => onComplete();
  }, [onComplete]);

  const renderEffect = () => {
    switch (type) {
      case 'attack':
        return <AttackEffect source={sourcePosition} target={targetPosition} />;
      case 'defense':
        return <DefenseEffect position={targetPosition} />;
      case 'special':
        return <SpecialEffect source={sourcePosition} target={targetPosition} />;
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {renderEffect()}
      </AnimatePresence>
    </div>
  );
}

function AttackEffect({ source, target }: { source: any; target: any }) {
  return (
    <motion.div
      initial={{ scale: 0, x: source.x, y: source.y }}
      animate={[
        { scale: 1, x: source.x, y: source.y },
        { x: target.x, y: target.y },
        { scale: 0 }
      ]}
      transition={{ duration: 0.5 }}
      className="absolute w-4 h-4 bg-red-500 rounded-full"
      style={{ left: -8, top: -8 }}
    >
      <motion.div
        className="absolute inset-0 bg-red-500 rounded-full"
        animate={{ scale: [1, 2], opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: 1 }}
      />
    </motion.div>
  );
}

function DefenseEffect({ position }: { position: any }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [1, 1.5], opacity: [1, 0] }}
      transition={{ duration: 0.5 }}
      className="absolute w-16 h-16 border-4 border-blue-500 rounded-full"
      style={{ left: position.x - 32, top: position.y - 32 }}
    >
      <motion.div
        className="absolute inset-0 border-4 border-blue-400 rounded-full"
        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
    </motion.div>
  );
}

function SpecialEffect({ source, target }: { source: any; target: any }) {
  return (
    <>
      <motion.div
        initial={{ scale: 0, x: source.x, y: source.y }}
        animate={[
          { scale: 1, x: source.x, y: source.y },
          { x: target.x, y: target.y },
          { scale: 0 }
        ]}
        transition={{ duration: 0.7 }}
        className="absolute w-8 h-8"
        style={{ left: -16, top: -16 }}
      >
        <motion.div
          className="absolute inset-0 bg-yellow-500 rotate-45"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </motion.div>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [1, 2], opacity: [1, 0] }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute w-32 h-32 bg-yellow-500/30 rounded-full"
        style={{ left: target.x - 64, top: target.y - 64 }}
      />
    </>
  );
}
