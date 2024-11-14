'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/stores/gameStore';
import { Card as CardComponent } from '@/components/game/Card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Shield, Sword, ScrollText, CircleDollarSign } from 'lucide-react';
import { Card, ResourceCard } from '@/lib/types/game';
import { cn } from '@/lib/utils';

interface PlayerHandProps {
  onCardClick?: (card: Card | ResourceCard) => void;
}

export function PlayerHand({ onCardClick }: PlayerHandProps) {
  const {
    playerHand,
    playerField,
    currentPhase,
    primaryResource,
    actionsRemaining,
    playCard,
    handleResourceCardUse
  } = useGameStore();

  const handleClick = useCallback((card: Card | ResourceCard, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Card clicked:', card); // Debug log

    // If external handler is provided, use it
    if (onCardClick) {
      onCardClick(card);
      return;
    }

    if (actionsRemaining <= 0 || currentPhase !== 'main') {
      console.log('Cannot play card - no actions or wrong phase');
      return;
    }

    if ('type' in card && (card.type === 'primary' || card.type === 'secondary')) {
      console.log('Playing resource card');
      handleResourceCardUse(card);
      return;
    }

    if (card.cost > primaryResource) {
      console.log('Not enough resources');
      return;
    }

    const emptySlot = playerField.findIndex(slot => slot === null);
    if (emptySlot !== -1) {
      console.log('Playing card in slot:', emptySlot);
      playCard(card, emptySlot);
    }
  }, [actionsRemaining, currentPhase, primaryResource, playerField, playCard, handleResourceCardUse, onCardClick]);

  const isCardPlayable = useCallback((card: Card | ResourceCard) => {
    if (actionsRemaining <= 0 || currentPhase !== 'main') return false;

    if ('type' in card && (card.type === 'primary' || card.type === 'secondary')) {
      return true;
    }

    return card.cost <= primaryResource;
  }, [actionsRemaining, currentPhase, primaryResource]);

  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex-1 relative">
        <div className="flex justify-center items-center gap-4">
          <AnimatePresence mode="popLayout">
            {playerHand.map((card, index) => (
              <Popover key={`${card.id}-${index}`}>
                <PopoverTrigger asChild>
                  <motion.div
                    initial={{ scale: 0.8, y: 100, opacity: 0 }}
                    animate={{
                      scale: 1,
                      y: 0,
                      opacity: 1,
                      rotate: (index - (playerHand.length - 1) / 2) * 5,
                      translateY: Math.abs((index - (playerHand.length - 1) / 2) * 2),
                    }}
                    exit={{ scale: 0.8, y: 100, opacity: 0 }}
                    style={{ originY: 1 }}
                    className="relative w-[180px] hover:-translate-y-8 transition-transform duration-200"
                    onClick={(e) => handleClick(card, e)}
                  >
                    <div
                      className={cn(
                        "cursor-pointer rounded-lg overflow-hidden",
                        isCardPlayable(card) ? 'hover:ring-2 hover:ring-blue-500' : '',
                        !isCardPlayable(card) && 'opacity-50'
                      )}
                    >
                      <CardComponent
                        card={card}
                        isInteractive={true}
                        isResource={'type' in card && (card.type === 'primary' || card.type === 'secondary')}
                        isPlayable={isCardPlayable(card)}
                        onClick={(e) => handleClick(card, e)}
                      />
                    </div>
                  </motion.div>
                </PopoverTrigger>
                <PopoverContent side="top" className="w-64">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{card.name}</h3>
                        <p className="text-sm text-muted-foreground">{card.faction} {card.type}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                        <CircleDollarSign className="w-4 h-4" />
                        <span className="text-sm font-bold">{card.cost}</span>
                      </div>
                    </div>

                    {card.attack !== undefined && card.defense !== undefined && (
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                          <Sword className="w-4 h-4 text-destructive" />
                          <span className="text-sm font-bold">{card.attack}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="text-sm font-bold">{card.defense}</span>
                        </div>
                      </div>
                    )}

                    {card.abilities?.length > 0 && (
                      <div className="space-y-2">
                        {card.abilities.map((ability) => (
                          <div key={ability.id} className="bg-muted p-2 rounded">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <ScrollText className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{ability.name}</span>
                              </div>
                              {ability.cost > 0 && (
                                <span className="text-xs bg-background/50 px-2 py-0.5 rounded-full">
                                  Cost: {ability.cost}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{ability.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
