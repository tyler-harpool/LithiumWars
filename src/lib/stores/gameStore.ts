'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import { Card, ResourceCard, GameState, BuildQueueItem } from '@/lib/types/game';

// Expanding the list of cards
// src/lib/stores/gameStore.ts

const sampleCards: Card[] = [
  {
    id: '1',
    name: 'Basic Infantry',
    type: 'unit',
    faction: 'mechanist',
    cost: 10,
    attack: 2,
    defense: 2,
    buildTime: 10,
    abilities: [],
    rarity: 'common',
    imageUrl: '/images/units/mechanist/basic-infantry.webp'
  },
  {
    id: '2',
    name: 'Steel Tank',
    type: 'unit',
    faction: 'mechanist',
    cost: 50,
    attack: 15,
    defense: 20,
    buildTime: 30,
    abilities: [{
      id: 'heavyArmor',
      name: 'Heavy Armor',
      description: 'Reduces incoming damage by 20%',
      cost: 0,
    }],
    rarity: 'rare',
    imageUrl: '/images/units/mechanist/steel-tank.webp'
  },
  {
    id: '3',
    name: 'Crystal Guard',
    type: 'unit',
    faction: 'luminari',
    cost: 20,
    attack: 5,
    defense: 10,
    buildTime: 15,
    abilities: [{
      id: 'crystalShield',
      name: 'Crystal Shield',
      description: 'Blocks 5 damage from each incoming attack.',
      cost: 0,
    }],
    rarity: 'uncommon',
    imageUrl: '/images/units/luminari/crystal-guard.webp'
  }
];

const sampleResourceCards: ResourceCard[] = [
  {
    id: 'pr1',
    name: 'Primary Generator',
    type: 'primary',
    value: 2,
    cost: 0,
    faction: 'neutral',
    abilities: [],
    imageUrl: '/images/resources/primary-generator.webp'
  },
  {
    id: 'pr2',
    name: 'Advanced Generator',
    type: 'primary',
    value: 5,
    cost: 15,
    faction: 'mechanist',
    abilities: [{
      id: 'resourceBoost',
      name: 'Resource Boost',
      description: 'Generates 50% more resources when adjacent to another generator.',
      cost: 0,
    }],
    imageUrl: '/images/resources/advanced-generator.webp'
  }
];

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  playerField: Array(5).fill(null),
  opponentField: Array(5).fill(null),
  currentPhase: 'main',
  activePlayer: 'player',
  turnNumber: 1,
  actionsRemaining: 4,
  maxActions: 4,
  primaryResource: 5,
  secondaryResource: 3,
  maxResources: 9999999,

  playerDeck: [...sampleCards, ...sampleResourceCards],
  playerHand: [],
  playerDiscardPile: [],
  opponentHand: 4,

  resourceGeneration: {
    primaryPerSecond: 0,
    secondaryPerSecond: 0
  },
  buildQueue: [],
  lastResourceTick: Date.now(),

  // Update resources based on generation rate
  updateResources: () => {
    const state = get();
    const now = Date.now();
    const deltaTime = (now - state.lastResourceTick) / 1000;

    if (deltaTime >= 1) {
      set(produce((state: GameState) => {
        state.primaryResource = Math.min(
          state.primaryResource + (state.resourceGeneration.primaryPerSecond * deltaTime),
          state.maxResources
        );
        state.secondaryResource = Math.min(
          state.secondaryResource + (state.resourceGeneration.secondaryPerSecond * deltaTime),
          state.maxResources
        );
        state.lastResourceTick = now;
      }));
    }
  },

  // Add a card to the build queue
  addToBuildQueue: (card: Card, position: number) => {
    set(produce((state: GameState) => {
      if (state.primaryResource >= card.cost) {
        state.buildQueue.push({
          id: `build-${Date.now()}`,
          card,
          targetPosition: position,
          startTime: Date.now(),
          buildTime: card.buildTime || 10,
          progress: 0
        });
        state.primaryResource -= card.cost;
        state.actionsRemaining--;
      }
    }));
  },

  // Update build queue progress
  updateBuildQueue: () => {
    set(produce((state: GameState) => {
      const now = Date.now();
      const completedBuilds: string[] = [];

      state.buildQueue = state.buildQueue.map(item => {
        const elapsedTime = (now - item.startTime) / 1000;
        const progress = Math.min((elapsedTime / item.buildTime) * 100, 100);

        if (progress >= 100) {
          state.playerField[item.targetPosition] = item.card;
          completedBuilds.push(item.id);
        }

        return { ...item, progress };
      });

      state.buildQueue = state.buildQueue.filter(
        item => !completedBuilds.includes(item.id)
      );
    }));
  },

  // Resource Methods
  addPrimaryResource: (amount: number) => {
    set(produce((state: GameState) => {
      state.primaryResource = Math.min(
        state.primaryResource + amount,
        state.maxResources
      );
    }));
  },

  addSecondaryResource: (amount: number) => {
    set(produce((state: GameState) => {
      state.secondaryResource = Math.min(
        state.secondaryResource + amount,
        state.maxResources
      );
    }));
  },

  // Add resource generation rates
  addPrimaryGenerationRate: (amount: number) => {
    set(produce((state: GameState) => {
      state.resourceGeneration.primaryPerSecond += amount;
    }));
  },

  addSecondaryGenerationRate: (amount: number) => {
    set(produce((state: GameState) => {
      state.resourceGeneration.secondaryPerSecond += amount;
    }));
  },

  // Update handleResourceCardUse to use the new methods
  handleResourceCardUse: (card: ResourceCard) => {
    set(produce((state: GameState) => {
      const handIndex = state.playerHand.findIndex(c => c.id === card.id);
      if (handIndex === -1) return;

      state.playerHand.splice(handIndex, 1);
      state.playerDiscardPile.push(card);

      if (card.type === 'primary') {
        state.resourceGeneration.primaryPerSecond += card.value;
      } else {
        state.resourceGeneration.secondaryPerSecond += card.value;
      }

      state.actionsRemaining--;
    }));
  },

  // Draw a card
  drawCard: () => {
    set(produce((state: GameState) => {
      if (state.playerDeck.length === 0 || state.playerHand.length >= 10) return;
      if (state.actionsRemaining <= 0) return;

      const drawnCard = state.playerDeck[0];
      state.playerDeck.splice(0, 1);
      state.playerHand.push(drawnCard);
      state.actionsRemaining--;
    }));
  },

  // Game loop
  gameLoop: () => {
    const state = get();
    state.updateResources();
    state.updateBuildQueue();
  },

  // End turn
  endTurn: () => set(produce((state: GameState) => {
    state.currentPhase = 'main';
    state.activePlayer = state.activePlayer === 'player' ? 'opponent' : 'player';
    state.actionsRemaining = state.maxActions;

    if (state.activePlayer === 'player') {
      if (state.playerDeck.length > 0 && state.playerHand.length < 10) {
        const drawnCard = state.playerDeck[0];
        state.playerDeck.splice(0, 1);
        state.playerHand.push(drawnCard);
      }
    }
  })),

  // Combat methods
  initiateCombat: (attackerPos: number, defenderPos: number) => {
    set(produce((state: GameState) => {
      const attacker = state.playerField[attackerPos];
      const defender = state.opponentField[defenderPos];

      if (!attacker || !defender) return;
      if (state.currentPhase !== 'combat') return;

      // Handle combat logic here
    }));
  },

  resolveCombat: () => {
    set(produce((state: GameState) => {
      // Handle combat resolution here
    }));
  },

  endCombatPhase: () => set({ currentPhase: 'end' })
}));
