// src/lib/types/game.ts

export type Faction = 'mechanist' | 'luminari' | 'swarmborn' | 'neutral';
export type CardType = 'unit' | 'building' | 'effect' | 'spell' | 'primary' | 'secondary';
export type Rarity = 'common' | 'rare' | 'legendary';
import { GAME_VIDEOS } from '@/lib/media';
export interface Card {
  id: string;
  name: string;
  type: CardType;
  faction: Faction;
  cost: number;
  attack?: number;
  defense?: number;
  abilities: Ability[];
  imageUrl?: string;
  rarity?: Rarity;
  buildTime?: number;
  description?: string; // Brief flavor text for lore or hints
  upgradesTo?: string; // ID of the next card if this one is upgradable
}


export interface ResourceCard extends Card {
  type: 'primary' | 'secondary';
  value: number; // Resources per second generated
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  cost: number;
  keywords?: string[]; // Optional tags like 'shield', 'poison', 'healing'
}


export interface BuildQueueItem {
  id: string;
  card: Card;
  targetPosition: number;
  startTime: number;
  buildTime: number;
  progress: number;
  isUpgrade?: boolean;
}


export interface GameState {
  playerHand: Card[];
  opponentHand: number;
  playerField: (Card | null)[];
  opponentField: (Card | null)[];
  primaryResource: number;
  secondaryResource: number;
  maxResources: number;
  currentPhase: GamePhase;
  activePlayer: 'player' | 'opponent';
  actionsRemaining: number;
  resourceGeneration: {
    primaryPerSecond: number;
    secondaryPerSecond: number;
  };
  buildQueue: BuildQueueItem[];
  lastResourceTick: number;

  // New fields
  upgradesAvailable: string[]; // List of IDs of cards available for upgrades
  specialCardsPlayed: Set<string>; // Track special or legendary cards used

  // Resource Methods
  addPrimaryResource: (amount: number) => void;
  addSecondaryResource: (amount: number) => void;
  addPrimaryGenerationRate: (amount: number) => void;
  addSecondaryGenerationRate: (amount: number) => void;

  // Building Methods
  addToBuildQueue: (card: Card, position: number) => void;
  updateBuildQueue: () => void;
  handleUpgrade: (cardId: string) => void; // Method to handle upgrades

  // Resource Card Methods
  handleResourceCardUse: (card: ResourceCard) => void;

  // Game Loop
  gameLoop: () => void;
  // Video playback
  currentVideo: string | null;
  isVideoPlaying: boolean;
  playVideo: (videoKey: keyof typeof GAME_VIDEOS) => void;
  endVideo: () => void;
}


export type GamePhase = 'draw' | 'main' | 'combat' | 'end';

export type Keyword = 'shield' | 'poison' | 'heal' | 'armor' | 'reflect' | 'aoe';
export type EffectType = 'damage' | 'heal' | 'buff' | 'debuff';

export interface Effect {
  id: string;
  type: EffectType;
  amount: number; // For example, +5 for healing or -5 for damage
  duration?: number; // Optional duration in turns
  keyword?: Keyword; // Any specific keyword effect
}


export const CARD_IMAGES = {
  units: {
    'basic-infantry': '/images/units/basic-infantry.webp',
    'steel-tank': '/images/units/steel-tank.webp',
    'crystal-guard': '/images/units/crystal-guard.webp'
  },
  resources: {
    'primary-generator': '/images/resources/primary-generator.webp',
    'advanced-generator': '/images/resources/advanced-generator.webp'
  }
} as const;
