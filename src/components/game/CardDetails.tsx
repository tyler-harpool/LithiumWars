'use client';

import { Card } from '@/lib/types/game';
import { Shield, Sword, ScrollText, CircleDollarSign } from 'lucide-react';

interface CardDetailsProps {
  card: Card;
}

export function CardDetails({ card }: CardDetailsProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{card.name}</h3>
          <p className="text-sm text-muted-foreground">{card.faction} {card.type}</p>
        </div>
        <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
          <CircleDollarSign className="w-4 h-4" />
          <span className="text-sm font-bold">{card.cost}</span>
        </div>
      </div>

      {/* Stats */}
      {card.attack !== undefined && card.defense !== undefined && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
            <Sword className="w-4 h-4 text-destructive" />
            <span className="font-bold">{card.attack}</span>
          </div>
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-bold">{card.defense}</span>
          </div>
        </div>
      )}

      {/* Abilities */}
      {card.abilities?.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Abilities:</div>
          {card.abilities.map((ability) => (
            <div
              key={ability.id}
              className="bg-muted p-2 rounded-lg"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-primary" />
                  <span className="font-medium">{ability.name}</span>
                </div>
                {ability.cost > 0 && (
                  <div className="text-sm bg-background/50 px-2 py-0.5 rounded-full">
                    Cost: {ability.cost}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {ability.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Additional Details */}
      <div className="text-sm text-muted-foreground border-t border-border pt-2">
        <div className="flex items-center justify-between">
          <span>Rarity:</span>
          <span className="capitalize font-medium">{card.rarity}</span>
        </div>
      </div>
    </div>
  );
}
