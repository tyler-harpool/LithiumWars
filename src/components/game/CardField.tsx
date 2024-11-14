'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card as CardType, Faction } from '@/lib/types/game';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Shield, Sword, ScrollText, CircleDollarSign } from 'lucide-react';
import { CardArt } from './CardArt';

interface CardFieldProps {
  position: number;
  card: CardType | null;
  isOpponent?: boolean;
  onAttack?: (position: number) => void;
}

const CardContent = React.forwardRef<
  HTMLDivElement,
  {
    card: CardType;
    isOpponent: boolean;
    onAttack?: (position: number) => void;
    position: number;
  }
>(({ card, isOpponent, onAttack, position }, ref) => {
  const getCardGlow = (faction: Faction) => {
    switch (faction) {
      case 'mechanist':
        return 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]';
      case 'luminari':
        return 'hover:shadow-[0_0_30px_rgba(147,51,234,0.3)]';
      case 'swarmborn':
        return 'hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]';
      default:
        return '';
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        'relative w-full h-full',
        !isOpponent && 'cursor-pointer',
        getCardGlow(card.faction)
      )}
      whileHover={!isOpponent ? {
        scale: 1.05,
        y: -5,
        transition: { duration: 0.2 }
      } : undefined}
      onClick={(e) => {
        e.stopPropagation();
        !isOpponent && onAttack?.(position);
      }}
    >
      <div className="absolute inset-0 bg-black rounded-lg overflow-hidden">
        {/* Faction-specific background gradient */}
        <div className={cn(
          'absolute inset-0 opacity-50',
          card.faction === 'mechanist' && 'bg-gradient-to-br from-blue-900/50 via-transparent to-blue-900/20',
          card.faction === 'luminari' && 'bg-gradient-to-br from-purple-900/50 via-transparent to-purple-900/20',
          card.faction === 'swarmborn' && 'bg-gradient-to-br from-red-900/50 via-transparent to-red-900/20'
        )} />

        {/* Card Content */}
        <div className="relative h-full p-3 flex flex-col">
          {/* Card Stats */}
          <div className="absolute top-2 left-2 flex gap-1">
            <motion.div
              className="w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
              animate={card.attack !== undefined ? {
                boxShadow: ['0 0 10px rgba(239, 68, 68, 0.2)', '0 0 20px rgba(239, 68, 68, 0.4)', '0 0 10px rgba(239, 68, 68, 0.2)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-red-400 font-bold">{card.attack}</span>
            </motion.div>
            <motion.div
              className="w-8 h-8 flex items-center justify-center bg-black/50 rounded-full"
              animate={card.defense !== undefined ? {
                boxShadow: ['0 0 10px rgba(59, 130, 246, 0.2)', '0 0 20px rgba(59, 130, 246, 0.4)', '0 0 10px rgba(59, 130, 246, 0.2)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <span className="text-blue-400 font-bold">{card.defense}</span>
            </motion.div>
          </div>

          {/* Card Cost */}
          <div className="absolute top-2 right-2">
            <motion.div
              className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"
              animate={{
                boxShadow: ['0 0 10px rgba(59, 130, 246, 0.2)', '0 0 20px rgba(59, 130, 246, 0.4)', '0 0 10px rgba(59, 130, 246, 0.2)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-white font-bold">{card.cost}</span>
            </motion.div>
          </div>

          {/* Card Name */}
          <div className="mt-12 text-center mb-2">
            <h3 className="text-white font-bold text-lg">{card.name}</h3>
          </div>

          {/* Card Art */}
          <div className="flex-1 flex items-center justify-center">
            <CardArt faction={card.faction} type={card.type} />
          </div>

          {/* Card Type */}
          <div className="mt-2 text-center">
            <span className="text-sm text-slate-400 px-2 py-1 rounded-full bg-black/30 border border-slate-700">
              {card.type} - {card.faction}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

CardContent.displayName = 'CardContent';

export function CardField({ position, card, isOpponent = false, onAttack }: CardFieldProps) {
  if (!card) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full h-full">
          <CardContent
            card={card}
            isOpponent={isOpponent}
            onAttack={onAttack}
            position={position}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'w-80 backdrop-blur-sm border-2',
          card.faction === 'mechanist' && 'border-blue-500/20',
          card.faction === 'luminari' && 'border-purple-500/20',
          card.faction === 'swarmborn' && 'border-red-500/20'
        )}
        side="top"
        sideOffset={5}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="space-y-4 p-4 rounded-lg bg-black/80"
        >
          {/* Header with glow effect */}
          <div className="relative">
            <motion.div
              className={cn(
                'absolute inset-0 opacity-50 blur-lg',
                card.faction === 'mechanist' && 'bg-blue-500/20',
                card.faction === 'luminari' && 'bg-purple-500/20',
                card.faction === 'swarmborn' && 'bg-red-500/20'
              )}
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{card.name}</h3>
                <p className="text-sm text-slate-400">{card.faction} {card.type}</p>
              </div>
              <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full border border-slate-700/50">
                <CircleDollarSign className="w-4 h-4" />
                <span className="text-sm font-bold">{card.cost}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          {card.attack !== undefined && card.defense !== undefined && (
            <div className="flex gap-4">
              <motion.div
                className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-red-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <Sword className="w-4 h-4 text-red-400" />
                <span className="font-bold text-red-400">{card.attack}</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 bg-black/50 px-3 py-1 rounded-full border border-blue-500/20"
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="font-bold text-blue-400">{card.defense}</span>
              </motion.div>
            </div>
          )}

          {/* Abilities */}
          {card.abilities?.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-semibold text-slate-300">Abilities:</div>
              {card.abilities.map((ability, index) => (
                <motion.div
                  key={ability.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={cn(
                      'bg-black/50 p-2 rounded-lg border border-slate-700/50',
                      'hover:border-slate-600/50 transition-colors'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ScrollText className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-300">{ability.name}</span>
                      </div>
                      {ability.cost > 0 && (
                        <div className="text-sm bg-black/50 px-2 py-0.5 rounded-full border border-slate-700/50">
                          Cost: {ability.cost}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      {ability.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}
