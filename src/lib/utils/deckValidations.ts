import { Card } from '@/lib/types/game';

export interface DeckValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DeckStats {
  unitCount: number;
  buildingCount: number;
  effectCount: number;
  averageCost: number;
  costCurve: Record<number, number>;
}

export function validateDeck(cards: Card[]): DeckValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check deck size
  if (cards.length < 40) {
    errors.push('Deck must contain exactly 40 cards');
  } else if (cards.length > 40) {
    errors.push('Deck cannot contain more than 40 cards');
  }

  // Check card limits (max 3 copies)
  const cardCounts = new Map<string, number>();
  cards.forEach(card => {
    cardCounts.set(card.id, (cardCounts.get(card.id) || 0) + 1);
  });

  cardCounts.forEach((count, cardId) => {
    if (count > 3) {
      errors.push(`Deck contains more than 3 copies of ${cards.find(c => c.id === cardId)?.name}`);
    }
  });

  // Calculate deck composition
  const stats = getDeckStats(cards);

  // Check unit ratio
  if (stats.unitCount < 15) {
    warnings.push('Deck contains fewer than 15 units');
  }

  // Check cost curve
  if (stats.averageCost > 4) {
    warnings.push('Average cost is quite high');
  }

  // Check faction consistency
  const factions = new Set(cards.map(card => card.faction));
  if (factions.size > 1) {
    errors.push('Deck contains cards from multiple factions');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

export function getDeckStats(cards: Card[]): DeckStats {
  const stats: DeckStats = {
    unitCount: 0,
    buildingCount: 0,
    effectCount: 0,
    averageCost: 0,
    costCurve: {}
  };

  cards.forEach(card => {
    // Count card types
    switch (card.type) {
      case 'unit':
        stats.unitCount++;
        break;
      case 'building':
        stats.buildingCount++;
        break;
      case 'effect':
        stats.effectCount++;
        break;
    }

    // Track cost curve
    stats.costCurve[card.cost] = (stats.costCurve[card.cost] || 0) + 1;
  });

  // Calculate average cost
  stats.averageCost = cards.reduce((sum, card) => sum + card.cost, 0) / cards.length;

  return stats;
}
