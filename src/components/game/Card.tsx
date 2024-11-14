'use client';

import { motion } from 'framer-motion';
import { Card as CardType, ResourceCard, Faction } from '@/lib/types/game';
import { CardEffects } from './CardEffects';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Shield, Sword, Zap, Crown } from 'lucide-react';

interface CardProps {
  card: CardType | ResourceCard;
  isInteractive?: boolean;
  isResource?: boolean;
  isPlayable?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const FACTION_COLORS = {
  mechanist: 'from-blue-500/20 to-cyan-500/20',
  luminari: 'from-yellow-500/20 to-orange-500/20',
  swarmborn: 'from-green-500/20 to-emerald-500/20',
  neutral: 'from-slate-500/20 to-gray-500/20'
} as const;

const FACTION_BORDERS = {
  mechanist: 'border-blue-500/50',
  luminari: 'border-yellow-500/50',
  swarmborn: 'border-green-500/50',
  neutral: 'border-slate-500/50'
} as const;

const DEFAULT_IMAGES = {
  unit: {
    mechanist: '/images/units/default-mechanist.webp',
    luminari: '/images/units/default-luminari.webp',
    swarmborn: '/images/units/default-swarmborn.webp',
    neutral: '/images/units/default-neutral.webp'
  },
  resource: {
    primary: '/images/resources/default-primary.webp',
    secondary: '/images/resources/default-secondary.webp'
  }
} as const;

export function Card({
  card,
  isInteractive = true,
  isResource = false,
  isPlayable = true,
  onClick,
  className = ''
}: CardProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInteractive && isPlayable && onClick) {
      onClick(e);
    }
  };

  const getDefaultImage = () => {
    if (isResource) {
      return DEFAULT_IMAGES.resource[(card as ResourceCard).type];
    }
    return DEFAULT_IMAGES.unit[card.faction as Faction];
  };

  const factionColor = FACTION_COLORS[card.faction as Faction] || FACTION_COLORS.neutral;
  const factionBorder = FACTION_BORDERS[card.faction as Faction] || FACTION_BORDERS.neutral;

  return (
    <motion.div
      whileHover={isInteractive && isPlayable ? {
        scale: 1.05,
        y: -10,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)'
      } : undefined}
      whileTap={isInteractive && isPlayable ? { scale: 0.95 } : undefined}
      className={cn(
        'relative w-full aspect-[2/3] border-2 rounded-xl overflow-hidden',
        'bg-gradient-to-br from-black/40 to-black/60',
        factionColor,
        factionBorder,
        isInteractive && isPlayable ? 'cursor-pointer hover:brightness-110' : '',
        !isPlayable && 'opacity-50 grayscale',
        isResource && 'border-emerald-500',
        className
      )}
      onClick={handleClick}
    >
      {/* Background Effects */}
      <CardEffects type={card.type} rarity={card.rarity} />

      {/* Card Content Container */}
      <div className="relative z-10 h-full p-3 flex flex-col">
        {/* Card Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-white drop-shadow-md">{card.name}</h3>
            <span className="text-xs text-white/70">{card.faction}</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{card.cost}</span>
          </div>
        </div>

        {/* Card Image */}
        <div className="mt-2 flex-1 rounded-lg overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 z-10" />
          <Image
            src={card.imageUrl || getDefaultImage()}
            alt={card.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Card Type & Stats */}
        <div className="mt-2 flex justify-between items-end">
          <div className="flex gap-2">
            {card.attack !== undefined && card.defense !== undefined && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Sword className="w-4 h-4 text-red-400" />
                  <span className="font-bold text-white">{card.attack}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white">{card.defense}</span>
                </div>
              </div>
            )}
            {isResource && 'value' in card && (
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-bold text-white">+{card.value}/s</span>
              </div>
            )}
          </div>
          {card.rarity && (
            <Crown className={cn(
              'w-5 h-5',
              card.rarity === 'legendary' ? 'text-yellow-400' :
              card.rarity === 'rare' ? 'text-blue-400' :
              'text-gray-400'
            )} />
          )}
        </div>

        {/* Abilities */}
        {card.abilities?.length > 0 && (
          <div className="mt-2 p-2 bg-black/40 backdrop-blur-sm rounded-lg border border-white/10">
            <p className="text-xs text-white/90">{card.abilities[0].description}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
