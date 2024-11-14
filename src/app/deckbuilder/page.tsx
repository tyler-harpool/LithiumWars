'use client';

import { DeckBuilder } from '@/components/deckbuilder/DeckBuilder';
import { useToast } from '@/hooks/use-toast';  // Using the correct path
import { Card } from '@/lib/types/game';

// Mock cards for testing
const mockCards: Card[] = [
  {
    id: '1',
    name: 'War Machine',
    type: 'unit',
    faction: 'mechanist',
    cost: 4,
    attack: 4,
    defense: 4,
    abilities: []
  },
  {
    id: '2',
    name: 'Crystal Sage',
    type: 'unit',
    faction: 'luminari',
    cost: 3,
    attack: 2,
    defense: 4,
    abilities: []
  }
];

export default function DeckBuilderPage() {
  const { toast } = useToast();

  const handleSaveDeck = async (deck: Card[]) => {
    toast({
      title: "Deck Saved",
      description: `Successfully saved deck with ${deck.length} cards.`
    });
  };

  return (
    <div className="container mx-auto p-4">
      <DeckBuilder
        cards={mockCards}
        onSave={handleSaveDeck}
      />
    </div>
  );
}
