'use client';

import { create } from 'zustand';
import { produce } from 'immer';
import { Card, ResourceCard, GameState, BuildQueueItem } from '@/lib/types/game';

import { soundManager } from '@/lib/sounds';


// Define video paths
export const GAME_VIDEOS = {
  INTRO: '/videos/intro.mp4',
  ROUND_START: '/videos/round-start.mp4',
  ROUND_END: '/videos/round-end.mp4',
  VICTORY: '/videos/victory.mp4',
  DEFEAT: '/videos/defeat.mp4'
} as const;

export type VideoKey = keyof typeof GAME_VIDEOS;


// Expanding the list of cards
// src/lib/stores/gameStore.ts
// Resource Constants
const RESOURCE_CONSTANTS = {
  BASE_GENERATION_RATE: {
    PRIMARY: 5,
    SECONDARY: 4,
  },
  MAX_RESOURCES: {
    PRIMARY: 10000,
    SECONDARY: 5000,
  },
  UNIT_COSTS: {
    BASIC: 50,
    ADVANCED: 150,
    ELITE: 300,
  },
  COLLECTION_INTERVAL: 100,
};

// Sample cards with upgrades and effects
const sampleCards: Card[] = [
  {
    id: '1',
    name: 'Basic Infantry',
    type: 'unit',
    faction: 'mechanist',
    cost: RESOURCE_CONSTANTS.UNIT_COSTS.BASIC,
    attack: 2,
    defense: 2,
    buildTime: 10,
    abilities: [],
    rarity: 'common',
    description: 'Standard mechanized infantry unit',
    upgradesTo: '2', // Upgrades to Advanced Infantry
    imageUrl: '/images/units/mechanist/basic-infantry.webp'
  },
  {
    id: '2',
    name: 'Advanced Infantry',
    type: 'unit',
    faction: 'mechanist',
    cost: RESOURCE_CONSTANTS.UNIT_COSTS.ADVANCED,
    attack: 4,
    defense: 4,
    buildTime: 15,
    abilities: [{
      id: 'reinforcedArmor',
      name: 'Reinforced Armor',
      description: 'Reduces incoming damage by 1',
      cost: 0,
      keywords: ['armor']
    }],
    rarity: 'rare',
    description: 'Upgraded infantry with enhanced armor',
    imageUrl: '/images/units/mechanist/steel-tank.webp'
  }
];

const sampleResourceCards: ResourceCard[] = [
  {
    id: 'pr1',
    name: 'Basic Generator',
    type: 'primary',
    value: 1,
    cost: 50,
    faction: 'neutral',
    abilities: [],
    description: 'Standard resource generator',
    upgradesTo: 'pr2',
    imageUrl: '/images/resources/primary-generator.webp'
  },
  {
    id: 'pr2',
    name: 'Advanced Generator',
    type: 'primary',
    value: 2,
    cost: 150,
    faction: 'mechanist',
    abilities: [{
      id: 'efficientGeneration',
      name: 'Efficient Generation',
      description: 'Generates 20% more resources when adjacent to another generator',
      cost: 0,
      keywords: ['efficiency']
    }],
    description: 'Enhanced generator with improved efficiency',
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
  actionsRemaining: 200,
  maxActions: 200,
  primaryResource: 5,
  secondaryResource: 4,
  maxResources: 9999,

  playerDeck: [...sampleCards, ...sampleResourceCards],
  playerHand: [],
  playerDiscardPile: [],
  opponentHand: 4,

  resourceGeneration: {
    primaryPerSecond: 0,
    secondaryPerSecond: 0
  },
  upgradesAvailable: [],
  buildQueue: [],
  lastResourceTick: Date.now(),
  // Video state
  currentVideo: null,
  isVideoPlaying: false,


  // Add methods for video handling
  playVideo: (videoKey: VideoKey) => set(
    produce((state: GameState) => {
      state.currentVideo = GAME_VIDEOS[videoKey];
      state.isVideoPlaying = true;
    })
  ),

  endVideo: () => set(
    produce((state: GameState) => {
      state.currentVideo = null;
      state.isVideoPlaying = false;
    })
  ),

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
  // Adding a card to the build queue
  addToBuildQueue: (card: Card, position: number) => {
    const state = get();

    if (state.primaryResource < card.cost) {
      soundManager.play('ERROR');
      return;
    }

    if (state.playerField[position] !== null) {
      soundManager.play('ERROR');
      return;
    }

    set(produce((state: GameState) => {
      console.log('Adding to build queue:', { card, position }); // Debug log

      soundManager.play('CARD_PLAY');

      state.buildQueue.push({
        id: `build-${Date.now()}`,
        card,
        targetPosition: position,
        startTime: Date.now(),
        buildTime: card.buildTime || 10,
        progress: 0,
        isUpgrade: false
      });

      state.primaryResource -= card.cost;
      state.actionsRemaining--;
    }));
  },

  // Processing the build queue
  updateBuildQueue: () => {
    const state = get();
    const now = Date.now();
    const completedBuilds: string[] = [];

    set(produce((state: GameState) => {
      state.buildQueue = state.buildQueue.map(item => {
        const elapsedTime = (now - item.startTime) / 1000;
        const progress = Math.min((elapsedTime / item.buildTime) * 100, 100);

        console.log('Processing build item:', {
          id: item.id,
          progress,
          elapsedTime,
          buildTime: item.buildTime
        }); // Debug log

        if (progress >= 100) {
          console.log('Completing build:', item); // Debug log

          if (item.isUpgrade) {
            const cardToUpgrade = state.playerField[item.targetPosition];
            if (cardToUpgrade?.upgradesTo) {
              const upgradedCard = [...sampleCards, ...sampleResourceCards]
                .find(c => c.id === cardToUpgrade.upgradesTo);
              if (upgradedCard) {
                state.playerField[item.targetPosition] = upgradedCard;
                soundManager.play('UPGRADE_COMPLETE');
              }
            }
          } else {
            // Place the card on the field
            state.playerField[item.targetPosition] = item.card;
            soundManager.play('CARD_PLAY');
          }
          completedBuilds.push(item.id);
        }

        return { ...item, progress };
      });

      // Remove completed builds
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
      soundManager.play('ERROR');
      if (state.actionsRemaining <= 0) return;
      const drawnCard = state.playerDeck[0];
      state.playerDeck.splice(0, 1);
      state.playerHand.push(drawnCard);
      soundManager.play('CARD_DRAW');
      state.actionsRemaining--;
    }));
  },

  // Resource Methods
  addPrimaryResource: (amount: number) => set(
    produce((state: GameState) => {
      state.primaryResource = Math.min(
        state.primaryResource + amount,
        RESOURCE_CONSTANTS.MAX_RESOURCES.PRIMARY
      );
    })
  ),

  addSecondaryResource: (amount: number) => set(
    produce((state: GameState) => {
      state.secondaryResource = Math.min(
        state.secondaryResource + amount,
        RESOURCE_CONSTANTS.MAX_RESOURCES.SECONDARY
      );
    })
  ),

  addPrimaryGenerationRate: (amount: number) => set(
    produce((state: GameState) => {
      state.resourceGeneration.primaryPerSecond += amount;
    })
  ),

  addSecondaryGenerationRate: (amount: number) => set(
    produce((state: GameState) => {
      state.resourceGeneration.secondaryPerSecond += amount;
    })
  ),

  // Building Methods
  addToBuildQueue: (card: Card, position: number) => {
    const state = get();

    if (state.primaryResource < card.cost) {
      soundManager.play('ERROR');
      return;
    }

    set(produce((state: GameState) => {
      soundManager.play('CARD_PLAY');

      // Add to build queue
      state.buildQueue.push({
        id: `build-${Date.now()}`,
        card,
        targetPosition: position,
        startTime: Date.now(),
        buildTime: card.buildTime || 10,
        progress: 0,
        isUpgrade: false
      });

      // Deduct resources and action
      state.primaryResource -= card.cost;
      state.actionsRemaining--;
    }));
  },

  updateBuildQueue: () => set(
    produce((state: GameState) => {
      const now = Date.now();
      const completedBuilds: string[] = [];

      state.buildQueue = state.buildQueue.map(item => {
        const elapsedTime = (now - item.startTime) / 1000;
        const progress = Math.min((elapsedTime / item.buildTime) * 100, 100);

        if (progress >= 100) {
          if (item.isUpgrade) {
            // Handle upgrade completion
            const cardToUpgrade = state.playerField[item.targetPosition];
            if (cardToUpgrade?.upgradesTo) {
              const upgradedCard = [...sampleCards, ...sampleResourceCards]
                .find(c => c.id === cardToUpgrade.upgradesTo);
              if (upgradedCard) {
                state.playerField[item.targetPosition] = upgradedCard;
              }
            }
          } else {
            // Handle normal build completion
            state.playerField[item.targetPosition] = item.card;
          }
          completedBuilds.push(item.id);
        }

        return { ...item, progress };
      });

      state.buildQueue = state.buildQueue.filter(
        item => !completedBuilds.includes(item.id)
      );
    })
  ),

  handleUpgrade: (cardId: string) => set(
    produce((state: GameState) => {
      const cardIndex = state.playerField.findIndex(card => card?.id === cardId);
      if (cardIndex === -1) return;

      const card = state.playerField[cardIndex];
      if (!card?.upgradesTo) return;

      const upgradedCard = [...sampleCards, ...sampleResourceCards]
        .find(c => c.id === card.upgradesTo);
      if (!upgradedCard) return;

      if (state.primaryResource >= upgradedCard.cost) {
        state.buildQueue.push({
          id: `upgrade-${Date.now()}`,
          card: upgradedCard,
          targetPosition: cardIndex,
          startTime: Date.now(),
          buildTime: upgradedCard.buildTime || 10,
          progress: 0,
          isUpgrade: true
        });
        state.primaryResource -= upgradedCard.cost;
        state.actionsRemaining--;
      }
    })
  ),

  // Resource Card Methods
  handleResourceCardUse: (card: ResourceCard) => set(
    produce((state: GameState) => {
      const handIndex = state.playerHand.findIndex(c => c.id === card.id);
      if (handIndex === -1) return;

      state.playerHand.splice(handIndex, 1);

      if (card.type === 'primary') {
        state.resourceGeneration.primaryPerSecond +=
          RESOURCE_CONSTANTS.BASE_GENERATION_RATE.PRIMARY * card.value;
      } else {
        state.resourceGeneration.secondaryPerSecond +=
          RESOURCE_CONSTANTS.BASE_GENERATION_RATE.SECONDARY * card.value;
      }

      state.actionsRemaining--;

      // Track special cards
      if (card.rarity === 'legendary') {
        state.specialCardsPlayed.add(card.id);
      }
    })
  ),

  // Game Loop
  gameLoop: () => {
    const state = get();
    const now = Date.now();
    const deltaTime = (now - state.lastResourceTick) / 1000;

    set(produce((state: GameState) => {
      // Update resources
      state.primaryResource = Math.min(
        state.primaryResource + (state.resourceGeneration.primaryPerSecond * deltaTime),
        state.maxResources
      );
      state.secondaryResource = Math.min(
        state.secondaryResource + (state.resourceGeneration.secondaryPerSecond * deltaTime),
        state.maxResources
      );
      state.lastResourceTick = now;

      // Update build progress
      state.buildQueue = state.buildQueue.map(item => {
        const elapsedTime = (now - item.startTime) / 1000;
        const progress = Math.min((elapsedTime / item.buildTime) * 100, 100);

        // If build is complete, place the card
        if (progress >= 100) {
          state.playerField[item.targetPosition] = item.card;
          return null; // This item will be filtered out
        }

        return { ...item, progress };
      }).filter(Boolean) as BuildQueueItem[]; // Remove completed items
    }));
  },

  // End turn
  endTurn: () => set(
    produce((state: GameState) => {
      soundManager.play('ROUND_END');
      state.playVideo('ROUND_END');

      state.currentPhase = 'main';
      state.activePlayer = state.activePlayer === 'player' ? 'opponent' : 'player';
      state.actionsRemaining = state.maxActions;

      if (state.activePlayer === 'player') {
        if (state.playerDeck.length > 0 && state.playerHand.length < 10) {
          const drawnCard = state.playerDeck[0];
          state.playerDeck.splice(0, 1);
          state.playerHand.push(drawnCard);
        }

        // Play round start video for player's turn
        state.playVideo('ROUND_START');
        soundManager.play('ROUND_START');
      }
    })
  ),

  // Combat methods
  initiateCombat: (attackerPos: number, defenderPos: number) => set(
    produce((state: GameState) => {
      const attacker = state.playerField[attackerPos];
      const defender = state.opponentField[defenderPos];

      if (!attacker || !defender) return;
      if (state.currentPhase !== 'combat') return;

      // Handle combat logic here
    })
  ),


  resolveCombat: () => set(
    produce((state: GameState) => {
      // Handle combat resolution here
    })
  ),

  endCombatPhase: () => set({ currentPhase: 'end' })
}));
