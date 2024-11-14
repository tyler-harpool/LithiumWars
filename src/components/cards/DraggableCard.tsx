'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Card as CardType } from '@/lib/types/game';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DraggableCardProps {
  card: CardType;
  onDragEnd: (card: CardType, dropPosition: { x: number; y: number }) => void;
  isPlayable?: boolean;
  className?: string;
}

export function DraggableCard({
  card,
  onDragEnd,
  isPlayable = true,
  className
}: DraggableCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotation = useTransform(x, [-200, 200], [-10, 10]);
  const scale = useTransform(y, [-200, 200], [0.8, 1.2]);

  return (
    <motion.div
      drag={isPlayable}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.7}
      whileHover={{ scale: 1.05 }}
      whileDrag={{ scale: 1.1, zIndex: 50 }}
      style={{ x, y, rotate: rotation, scale }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        onDragEnd(card, { x: info.offset.x, y: info.offset.y });
      }}
      className={cn(
        'relative w-[200px] h-[280px] rounded-lg bg-slate-700',
        'cursor-grab active:cursor-grabbing select-none',
        isDragging ? 'shadow-xl' : 'shadow-md',
        !isPlayable && 'opacity-50 cursor-default',
        className
      )}
    >
      {/* Card Content */}
      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-blue-500
                    flex items-center justify-center">
        <span className="text-white font-bold">{card.cost}</span>
      </div>

      <div className="p-4">
        <h3 className="text-white font-bold">{card.name}</h3>
        <div className="mt-2 text-slate-300 text-sm">{card.type}</div>
      </div>

      {(card.attack !== undefined && card.defense !== undefined) && (
        <div className="absolute bottom-2 left-2 text-white">
          {card.attack} / {card.defense}
        </div>
      )}
    </motion.div>
  );
}
