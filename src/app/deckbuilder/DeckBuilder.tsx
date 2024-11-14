'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Faction } from '@/lib/types/game';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Filter, Save, MinusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CardTooltip } from '@/components/deckbuilder/CardTooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeckBuilderProps {
  cards: Card[];
  onSave: (deck: Card[]) => void;
}

export function DeckBuilder({ cards, onSave }: DeckBuilderProps) {
  const [selectedFaction, setSelectedFaction] = useState<Faction>('mechanist');
  const [searchQuery, setSearchQuery] = useState('');
  const [deckName, setDeckName] = useState('New Deck');
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [costFilter, setCostFilter] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredCards = useMemo(() => {
    return cards.filter(card =>
      card.faction === selectedFaction &&
      card.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (costFilter === null || card.cost === costFilter)
    );
  }, [cards, selectedFaction, searchQuery, costFilter]);

  const deckStats = useMemo(() => {
    return {
      totalCards: selectedCards.length,
      averageCost: selectedCards.reduce((acc, card) => acc + card.cost, 0) / selectedCards.length || 0,
      costDistribution: selectedCards.reduce((acc, card) => {
        acc[card.cost] = (acc[card.cost] || 0) + 1;
        return acc;
      }, {} as Record<number, number>),
      typeDistribution: selectedCards.reduce((acc, card) => {
        acc[card.type] = (acc[card.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [selectedCards]);

  const addCard = (card: Card) => {
    if (selectedCards.length >= 40) {
      toast({
        title: "Deck is full",
        description: "Maximum deck size is 40 cards",
        variant: "destructive"
      });
      return;
    }

    const copiesInDeck = selectedCards.filter(c => c.id === card.id).length;
    if (copiesInDeck >= 3) {
      toast({
        title: "Card limit reached",
        description: "Maximum 3 copies of each card allowed",
        variant: "destructive"
      });
      return;
    }

    setSelectedCards(prev => [...prev, card]);
  };

  const removeCard = (index: number) => {
    setSelectedCards(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid grid-cols-[350px_1fr] gap-6 h-[calc(100vh-2rem)]">
      {/* Deck List */}
      <div className="bg-slate-800 rounded-lg p-4 flex flex-col">
        <div className="space-y-4 mb-4">
          <Input
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            className="w-full"
            placeholder="Deck Name"
          />

          <Select
            value={selectedFaction}
            onValueChange={(value) => setSelectedFaction(value as Faction)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Faction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mechanist">Mechanist</SelectItem>
              <SelectItem value="luminari">Luminari</SelectItem>
              <SelectItem value="swarmborn">Swarmborn</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-slate-400">
            {selectedCards.length}/40 cards
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSave(selectedCards)}
            disabled={selectedCards.length < 40}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Deck
          </Button>
        </div>

        <ScrollArea className="h-full">
          <AnimatePresence mode="popLayout">
            {selectedCards.map((card, index) => (
              <motion.div
                key={`${card.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <CardTooltip card={card}>
                  <div className="flex items-center justify-between p-2 mb-2 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{card.cost}</Badge>
                      <span className="text-sm">{card.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCard(index);
                      }}
                    >
                      <MinusCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTooltip>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>

        {/* Deck Stats */}
        <div className="mt-4 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Deck Statistics</h3>
          <div className="space-y-2 text-sm text-slate-300">
            <div>Average Cost: {deckStats.averageCost.toFixed(2)}</div>
            <div className="flex gap-2">
              {Object.entries(deckStats.typeDistribution).map(([type, count]) => (
                <Badge key={type} variant="secondary">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Card Browser */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search cards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="w-4 h-4" />}
            />
          </div>
          <Select
            value={costFilter?.toString() || "all"}
            onValueChange={(value) => setCostFilter(value === "all" ? null : parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Cost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Costs</SelectItem>
              {[1, 2, 3, 4, 5, 6].map((cost) => (
                <SelectItem key={cost} value={cost.toString()}>
                  {cost} Cost
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <CardTooltip key={card.id} card={card}>
                <div
                  className="relative aspect-[2/3] bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors"
                  onClick={() => addCard(card)}
                >
                  <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-bold">{card.cost}</span>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-white">{card.name}</h3>
                    <p className="text-sm text-slate-300">{card.type}</p>
                    {card.attack !== undefined && card.defense !== undefined && (
                      <div className="absolute bottom-4 left-4 text-white">
                        {card.attack}/{card.defense}
                      </div>
                    )}
                  </div>
                </div>
              </CardTooltip>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
