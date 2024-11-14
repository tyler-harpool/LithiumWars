'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card as CardType } from '@/lib/types/game';
import { Shield, Sword, CircleDollarSign, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardTooltipProps {
  card: CardType;
  children: React.ReactNode;
}

export function CardTooltip({ card, children }: CardTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          className="w-80 bg-black/90 border border-gray-800 p-4 rounded-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-bold text-white">{card.name}</h3>
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-white font-bold">{card.cost}</span>
              </div>
            </div>

            {/* Stats */}
            {card.attack !== undefined && card.defense !== undefined && (
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <Sword className="w-4 h-4 text-red-400" />
                  <span className="text-white font-bold">{card.attack}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-white font-bold">{card.defense}</span>
                </div>
              </div>
            )}

            {/* Abilities */}
            {card.abilities?.map((ability, index) => (
              <div key={index} className="border-t border-gray-800 pt-2">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">
                    {ability.name}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{ability.description}</p>
              </div>
            ))}
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
